#!/usr/bin/env python

import MySQLdb as mdb
import sys
import json
import cgitb
import traceback
import os
import re
from psycopg import sql

sys.path.append("../../")
import config

cgitb.enable()

# create database connection
try:
	conn = mdb.connect(host=config.sqlh, db=config.sqld, passwd=config.sqlp, user=config.sqlu)
	cursor = conn.cursor(mdb.cursors.DictCursor)
except mdb.Error as e:
	print("Content-type: text/html\n\n")
	print("<h2>Error</h2>")
	print("Error %d: %s" % (e.args[0], e.args[1]))
	sys.exit(1)

try:
	admin = False
	outputhtml = ""
	sqlcommands = []
	if "HTTP_COOKIE" in os.environ:
		cookies = os.environ["HTTP_COOKIE"]
		cookies = cookies.split("; ")
		isLoggedIn = False
		loggedInValue = ""
		for cookie in cookies:
			cookie = cookie.split("=")
			if cookie[0] == "frp":
				isLoggedIn = True
				loggedInValue = cookie[1]
		if isLoggedIn:
			data = loggedInValue
			admin = True
		else:
			outputhtml = open("../content/404.html").read()
	else:
		outputhtml = open("../content/404.html").read()

	if admin:
		data = json.load(sys.stdin)
		if data["type"] == "addSingle":
			sqlStatement = "INSERT INTO products (name, image) VALUES({name}, {image})".format(
				name=sql.Literal(data["name"]),
				image=sql.Literal(data["image"])
			)
			sqlcommands.append(sqlStatement)
			if data["dryrun"]:
				newid = "123"
			else:
				cursor.execute(sqlStatement)
				newid = cursor.lastrowid

			sqlStatement = ""
			for link in data["links"]:
				if sqlStatement != "":
					sqlStatement += ","
				sqlStatement += "({newid}, {name}, {link})".format(newid=sql.Literal(newid),
																   name=sql.Literal(link["name"]),
																   link=sql.Literal(link["link"]))
			sqlStatement = "INSERT INTO links (productid, vendor, link) VALUES %s" % sqlStatement
			sqlcommands.append(sqlStatement)
			if not data["dryrun"]:
				cursor.execute(sqlStatement)

			sqlStatement = ""
			for tag in data["tags"]:
				if sqlStatement != "":
					sqlStatement += ","
				sqlStatement += "({newid}, {tag})".format(newid=sql.Literal(newid), tag=sql.Literal(tag))
			sqlStatement = "INSERT INTO producttag (productid, tagid) VALUES %s" % sqlStatement
			sqlcommands.append(sqlStatement)
			if data['dryrun']:
				outputhtml = sqlcommands
			else:
				cursor.execute(sqlStatement)
				conn.commit()
				outputhtml = 'Successful'
		elif data["type"] == "edit":
			productid = data["productid"]
			sqlStatement = "UPDATE products SET name={name}, image={image} WHERE productid={productid}".format(
				name=sql.Literal(data["name"]),
				image=sql.Literal(data["image"]),
				productid=sql.Literal(productid))
			sqlcommands.append(sqlStatement)
			if not data["dryrun"]:
				cursor.execute(sqlStatement)

			sqlStatement = "DELETE FROM links WHERE productid={productid}".format(productid=sql.Literal(productid))
			sqlcommands.append(sqlStatement)
			if not data["dryrun"]:
				cursor.execute(sqlStatement)

			sqlStatement = ""
			for link in data["links"]:
				if sqlStatement != "":
					sqlStatement += ","
				sqlStatement += "({productid}, {name}, {link})".format(
					productid=sql.Literal(productid),
					name=sql.Literal(link["name"]),
					link=sql.Literal(link["link"]))
			sqlStatement = "INSERT INTO links (productid, vendor, link) VALUES %s" % sqlStatement
			sqlcommands.append(sqlStatement)
			if not data["dryrun"]:
				cursor.execute(sqlStatement)

			sqlStatement = "DELETE FROM producttag WHERE productid={productid}".format(productid=sql.Literal(productid))
			sqlcommands.append(sqlStatement)
			if not data["dryrun"]:
				cursor.execute(sqlStatement)

			sqlStatement = ""
			for tag in data["tags"]:
				if sqlStatement != "":
					sqlStatement += ","
				sqlStatement += "({productid}, {tag})".format(productid=sql.Literal(productid), tag=sql.Literal(tag))
			sqlStatement = "INSERT INTO producttag (productid, tagid) VALUES %s" % sqlStatement
			sqlcommands.append(sqlStatement)

			if data['dryrun']:
				outputhtml = sqlcommands
			else:
				cursor.execute(sqlStatement)
				conn.commit()
				outputhtml = 'Successful'

		elif data["type"] == "addMultiple":
			tagids = []
			vendorloc = 0
			sqlStatement = "SELECT * FROM categories WHERE groupid={groupid} ORDER BY value".format(
				groupid=sql.Literal(data["groupid"]))
			cursor.execute(sqlStatement)
			rows = cursor.fetchall()
			for row in rows:
				tagids.append(row["categoryid"])
				if row["value"] == "Vendors":
					vendorloc = len(tagids)

			tags = {}
			for categoryid in tagids:
				sqlStatement = "SELECT * FROM tags WHERE categoryid={categoryid}".format(
					categoryid=sql.Literal(categoryid))
				cursor.execute(sqlStatement)
				rows = cursor.fetchall()
				if not (categoryid in tags):
					tags[categoryid] = {}
				for row in rows:
					tags[categoryid][row["value"]] = row["tagid"]

			products = []
			for product in re.split("\r?\n", data["data"]):
				productList = product.split("\t")
				for i in range(len(productList)):
					if i != 0 and i < len(tagids) + 1:
						productList[i] = re.split(" ?, ?", productList[i])
				products.append(productList)

			for product in products:
				sqlStatement = "INSERT INTO products (name, image) VALUES({name}, {image})".format(
					name=sql.Literal(product[0]), image=sql.Literal(product[-1]))
				sqlcommands.append(sqlStatement)
				if not data["dryrun"]:
					cursor.execute(sqlStatement)
					newid = cursor.lastrowid
				else:
					newid = "1234"

				vendors = product[vendorloc]
				for i in range(len(vendors)):
					sqlStatement = "INSERT INTO links (productid, vendor, link) VALUES ({newid}, {vendor}, {link})".format(
						newid=sql.Literal(newid), vendor=sql.Literal(vendors[i]),
						link=sql.Literal(product[len(tagids) + i + 1]))
					sqlcommands.append(sqlStatement)
					if not data["dryrun"]:
						cursor.execute(sqlStatement)

				for i in range(1, len(tagids) + 1):
					for tag in product[i]:
						if tag not in tags[tagids[i - 1]]:
							sqlStatement = "INSERT INTO tags (categoryid, value) VALUES ({categoryid}, {value})".format(
								categoryid=sql.Literal(tagids[i - 1]), value=sql.Literal(tag))
							sqlcommands.append(sqlStatement)
							if not data["dryrun"]:
								cursor.execute(sqlStatement)
								tagvalue = cursor.lastrowid
							else:
								tagvalue = "12345"
							tags[tagids[i - 1]][tag] = tagvalue
						else:
							tagvalue = tags[tagids[i - 1]][tag]
						sqlStatement = "INSERT INTO producttag (productid, tagid) VALUES ({productid}, {tagid})".format(
							productid=sql.Literal(newid), tagid=sql.Literal(tagvalue))
						sqlcommands.append(sqlStatement)
						if not data["dryrun"]:
							cursor.execute(sqlStatement)
			if data['dryrun']:
				outputhtml = sqlcommands
			else:
				conn.commit()
				outputhtml = 'Successful'
		elif data["type"] == "newGroup":
			sqlStatement = "INSERT INTO groups (value, description, image, pathname, spreadsheet) VALUES({name}, {description}, {imageFilename}, {imageFolder}, {spreadsheet})".format(
				name=sql.literal(data["name"]),
				description=sql.literal(data["description"]),
				imageFolder=sql.literal(data["imageFolder"]),
				imageFilename=sql.literal(data["imageFilename"]),
				spreadsheet=sql.literal(data["spreadsheet"]))
			sqlcommands.append(sqlStatement)
			if not data["dryrun"]:
				cursor.execute(sqlStatement)
				newid = cursor.lastrowid
			else:
				newid = "123"

			categories = re.split(" ?\t ?", data["categories"])
			for index, category in enumerate(categories):
				sqlStatement = "INSERT INTO categories (groupid, value, priority) VALUES({groupid}, {value}, {priority})".format(
					groupid=sql.Literal(newid), value=sql.Literal(category), priority=index + 1)
				sqlcommands.append(sqlStatement)
				if not data["dryrun"]:
					cursor.execute(sqlStatement)
			if data['dryrun']:
				outputhtml = sqlcommands
			else:
				conn.commit()
				outputhtml = 'Successful'
		elif data["type"] == "editGroup":
			sqlStatement = "UPDATE groups SET value = {name}, description = {description}, image = {imageFilename}, pathname = {imageFolder}, spreadsheet = {spreadsheet} WHERE groupid = {groupid}".format(
				name=sql.literal(data["name"]),
				description=sql.literal(data["description"]),
				imageFolder=sql.literal(data["imageFolder"]),
				imageFilename=sql.literal(data["imageFilename"]),
				spreadsheet=sql.literal(data["spreadsheet"]),
				groupid=sql.literal(data["groupid"]))
			sqlcommands.append(sqlStatement)
			conn.commit()
			if not data['dryrun']:
				cursor.execute(sqlStatement)
				conn.commit()
				outputhtml = "Successful"
			else:
				outputhtml = sqlcommands

	print("Content-type: text/html\n\n")
	print(outputhtml)
	conn.close()

except Exception:
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
