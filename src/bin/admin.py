#!/usr/bin/env python

import MySQLdb as mdb
import sys
import json
import cgitb
import traceback
import os
import re
import Cookie

sys.path.append("../../")
import config

cgitb.enable()

#create database connection
try:
	conn = mdb.connect(host=config.sqlh, db=config.sqld, passwd=config.sqlp, user=config.sqlu)
	cursor = conn.cursor(mdb.cursors.DictCursor)
except mdb.Error, e:
	print("Content-type: text/html\n\n")
	print("<h2>Error</h2>")
	print("Error %d: %s" % (e.args[0], e.args[1]))
	sys.exit(1)

try:
	admin = False
	outputhtml = ""
	if 'HTTP_COOKIE' in os.environ:
		cookie_string = os.environ.get('HTTP_COOKIE')
		c = Cookie.SimpleCookie()
		c.load(cookie_string)

		try :
			data = c['frp'].value
			admin = True
		except KeyError :
			outputhtml = open("../content/404.html").read()
	else :
		outputhtml = open("../content/404.html").read()

	if admin :
		data = json.load(sys.stdin)
		if data["type"] == "addSingle" :
			sql = "INSERT INTO products (name, image) VALUES(%s, %s)" % (conn.literal(data["name"]), conn.literal(data["image"]))
			outputhtml = sql
			#cursor.execute(sql)
			#newid = cursor.lastrowid
			newid = "12345"

			#cursor.execute(sql)
			sql = ""
			for link in data["links"] :
				if sql != "" :
					sql += ","
				sql += "(%s, %s, %s)" % (conn.literal(newid), conn.literal(link["name"]), conn.literal(link["link"]))
			sql = "INSERT INTO links (productid, vendor, link) VALUES %s" % sql
			#cursor.execute(sql)
			outputhtml += "\n" + sql

			sql = ""
			for tag in data["tags"] :
				if sql != "" :
					sql += ","
				sql += "(%s, %s)" % (conn.literal(newid), conn.literal(tag))
			sql = "INSERT INTO producttag (productid, tagid) VALUES %s" % sql
			#cursor.execute(sql)
			#conn.commit()
			outputhtml += "\n" + sql
		elif data["type"] == "edit" :
			productid = data["productid"]
			sql = "UPDATE products SET name=%s, image=%s WHERE productid=%s" % (conn.literal(data["name"]), conn.literal(data["image"]), conn.literal(productid))
			#cursor.execute(sql)
			outputhtml = sql

			sql = "DELETE FROM links WHERE productid=%s" % conn.literal(productid)
			#cursor.execute(sql)
			outputhtml += "\n" + sql

			sql = ""
			for link in data["links"] :
				if sql != "" :
					sql += ","
				sql += "(%s, %s, %s)" % (conn.literal(productid), conn.literal(link["name"]), conn.literal(link["link"]))
			sql = "INSERT INTO links (productid, vendor, link) VALUES %s" % sql
			#cursor.execute(sql)
			outputhtml += "\n" + sql

			sql = "DELETE FROM producttag WHERE productid=%s" % conn.literal(productid)
			#cursor.execute(sql)
			outputhtml += "\n" + sql

			sql = ""
			for tag in data["tags"] :
				if sql != "" :
					sql += ","
				sql += "(%s, %s)" % (conn.literal(productid), conn.literal(tag))
			sql = "INSERT INTO producttag (productid, tagid) VALUES %s" % sql
			#cursor.execute(sql)
			#conn.commit()
			outputhtml += "\n" + sql

		elif data["type"] == "addMultiple" :
			tagids = []
			vendorloc = 0
			sql = "SELECT * FROM categories WHERE groupid=%s ORDER BY value" % conn.literal(data["groupid"])
			cursor.execute(sql)
			rows = cursor.fetchall()
			for row in rows :
				tagids.append(row["categoryid"])
				if row["value"] == "Vendors" :
					vendorloc = len(tagids)

			tags = {}
			for categoryid in tagids :
				sql = "SELECT * FROM tags WHERE categoryid=%s" % conn.literal(categoryid)
				cursor.execute(sql)
				rows = cursor.fetchall()
				if not (categoryid in tags) :
					tags[categoryid] = {}
				for row in rows :
					tags[categoryid][row["value"]] = row["tagid"]
			
			products = []
			for product in re.split("\r?\n", data["data"]) :
				productList = product.split("\t")
				for i in range(len(productList)) :
					if i != 0 and i < len(tagids)+1 :
						productList[i] = re.split(" ?, ?", productList[i])
				products.append(productList)
			
			for product in products :
				sql = "INSERT INTO products (name, image) VALUES(%s, %s)" % (conn.literal(product[0]), conn.literal(product[-1]))
				#cursor.execute(sql)
				#newid = cursor.lastrowid
				outputhtml = sql
				newid = 12345

				vendors = product[vendorloc]
				for i in range(len(vendors)) :
					sql = "INSERT INTO links (productid, vendor, link) VALUES (%s, %s, %s)" % (conn.literal(newid), conn.literal(vendors[i]), conn.literal(product[len(tagids)+i+1]))
					#cursor.execute(sql)
					outputhtml += "\n" + sql

				for i in range(1,len(tagids)+1) :
					for tag in product[i] :
						if tag not in tags[tagids[i-1]] :
							sql = "INSERT INTO tags (categoryid, value) VALUES (%s, %s)" % (conn.literal(tagids[i-1]), conn.literal(tag))
							#cursor.execute(sql)
							#tagvalue = cursor.lastrowid
							tagvalue = 1735
							outputhtml += "\n" + sql
							tags[tagids[i-1]][tag] = tagvalue
						else :
							tagvalue = tags[tagids[i-1]][tag]
						sql = "INSERT INTO producttag (productid, tagid) VALUES (%s, %s)" % (conn.literal(newid), conn.literal(tagvalue))
						#cursor.execute(sql)
						outputhtml += "\n" + sql
			#conn.commit()
		elif data["type"] == "newGroup" :
			sql = "INSERT INTO groups (value, description, image, pathname, spreadsheet) VALUES(%s, %s, %s, %s, %s)" % (conn.literal(data["name"]),conn.literal(data["description"]),conn.literal(data["imageFolder"]),conn.literal(data["imageFilename"]),conn.literal(data["spreadsheet"]))
			#cursor.execute(sql)
			#newid = cursor.lastrowid
			outputhtml = sql
			newid = 12345

			categories = re.split(" ?\t ?", data["categories"])
			for index, category in enumerate(categories) :
				sql = "INSERT INTO categories (groupid, value, priority) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(category), index+1)
				#cursor.execute(sql)
				outputhtml += "\n" + sql

			#conn.commit()

	print("Content-type: text/html\n\n")
	print(outputhtml)

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
