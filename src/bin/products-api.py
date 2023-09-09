#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb
import re
import traceback
import json

sys.path.append("../../")
import config

def errorOccurred(message) :
	print("Content-type: text/html\n\n")
	print("<h2>An error occured</h2>")
	print("<p>%s</p>" % message)
	sys.exit(1)

try :
	cgitb.enable()
	form = cgi.FieldStorage()

	type = form.getvalue("type")
	product = form.getvalue("product")
	categories = form.getvalue("categories")
	tags = form.getvalue("categories")

	stringlist = re.compile("^[0-9,]+$")
	if categories is None or tags is None or not stringlist.match(categories) or not stringlist.match(tags) :
		categories = None
		tags = None

	#create database connection
	try:
		conn = mdb.connect(host=config.sqlh, db=config.sqld, passwd=config.sqlp, user=config.sqlu)
		cursor = conn.cursor(mdb.cursors.DictCursor)
	except mdb.Error as e:
		errorOccurred("Faild to connect to database<br>%d: %s" % (e.args[0], e.args[1]))

	data = {}

	if type == "product" :
		if product is None or not re.compile("^(3d/)?[a-z\-]+").match(product) :
			product = None
			errorOccurred("Product was not defined")

		productId = None
		cursor.execute("SELECT * FROM groups WHERE pathname=%(product)s", {'product': product})
		if cursor.rowcount == 1 :
			productRow = cursor.fetchone()
			if not productRow["groupid"] :
				errorOccurred("Product does not exist")
			productId = productRow["groupid"]
		else :
			errorOccurred("Product does not exist")

		sql = "SET @@group_concat_max_len = 2048"
		cursor.execute(sql)

		if tags is None or categories is None :
			cursor.execute("""\
				SELECT prodtable.productid, prodtable.name, prodtable.image, 
					group_concat(prodtable.value ORDER BY prodtable.priority SEPARATOR '||') AS categories, 
					group_concat(prodtable.tagvalue ORDER BY prodtable.priority SEPARATOR '||') AS tags, 
					group_concat(prodtable.tagids ORDER BY prodtable.priority SEPARATOR '||') AS tagids,
					linklist.vendors, linklist.links
				FROM (
					SELECT 
					products.productid, products.name, products.image, 
					tags.tagid, tags.categoryid, 
					categories.value, categories.priority, 
					group_concat(tags.value ORDER BY tags.value*1, tags.value SEPARATOR ', ') AS tagvalue,
					group_concat(tags.tagid ORDER BY tags.value*1, tags.value SEPARATOR ',') AS tagids
					FROM producttag 
					LEFT JOIN tags ON producttag.tagid = tags.tagid 
					LEFT JOIN products ON products.productid = producttag.productid
					LEFT JOIN categories ON categories.categoryid = tags.categoryid
					WHERE categories.groupid=%(productid)s
					GROUP BY products.productid, tags.categoryid
				) AS prodtable
				LEFT JOIN (
					SELECT productid, group_concat(Vendor ORDER BY Vendor SEPARATOR '||') AS vendors, 
					group_concat(link ORDER BY Vendor SEPARATOR '||') AS links 
					FROM links 
					GROUP BY productid
				) AS linklist ON prodtable.productid = linklist.productid
				GROUP BY productid
				ORDER BY prodtable.name
			""", {'productid': productId})
		else :
			cursor.execute("""\
				SELECT prodtable.productid, prodtable.name, prodtable.image, group_concat(prodtable.value ORDER BY prodtable.priority SEPARATOR '||') AS categories, group_concat(prodtable.tagvalue ORDER BY prodtable.priority SEPARATOR '||') AS tags, linklist.vendors, linklist.links
				FROM (
					SELECT 
					products.productid, products.name, products.image, tags.tagid, tags.categoryid, categories.value, categories.priority, group_concat(tags.value ORDER BY tags.value*1, tags.value SEPARATOR ', ') AS tagvalue
					FROM (
						SELECT productid FROM (
							SELECT productid
							FROM producttag
							LEFT JOIN tags ON producttag.tagid = tags.tagid
							WHERE producttag.tagid IN (%{tags}s)
							GROUP BY producttag.productid, tags.categoryid) AS a
						GROUP BY productid
						HAVING COUNT(productid) = %(productid)s) AS productids
					LEFT JOIN products ON productids.productid = products.productid
					LEFT JOIN producttag ON products.productid = producttag.productid
					LEFT JOIN tags ON producttag.tagid = tags.tagid 
					LEFT JOIN categories ON categories.categoryid = tags.categoryid
					WHERE categories.groupid=%(groupdid)s
					GROUP BY products.productid, tags.categoryid
				) AS prodtable
				LEFT JOIN (SELECT productid, group_concat(Vendor ORDER BY Vendor SEPARATOR '||') AS vendors, group_concat(link ORDER BY Vendor SEPARATOR '||') AS links FROM links GROUP BY productid) AS linklist ON prodtable.productid = linklist.productid
				GROUP BY productid
				ORDER BY prodtable.name
			""", {'tags': tags, 'productid': len(categories.split(",")), 'groupid': productId})

		productRows = cursor.fetchall()

		cursor.execute("SELECT categoryid, value FROM categories WHERE groupid=%(productid)s ORDER BY priority", {'productid': productId})
		categoryRows = cursor.fetchall()

		categories = []
		for row in categoryRows :
			cursor.execute("SELECT tagid, value FROM tags WHERE categoryid = %(catid)s ORDER BY value*1, value", {'catid': row["categoryid"]})
			tagRows = cursor.fetchall()
			categories.append({
				"categoryid": row["categoryid"],
				"value": row["value"],
				"tags": tagRows
			})

		data = {
			"productid": productRow["groupid"],
			"title": productRow["value"],
			"pathname": productRow["pathname"],
			"description": productRow["description"],
			"imageslug": productRow["image"],
			"spreadsheet": productRow["spreadsheet"],
			"categories": categories,
			"products": productRows
		}
	elif type == "groups" :
		sql = """\
			SELECT groups.groupid, groups.value, groups.pathname, groups.description, groups.image, groups.spreadsheet, 
				group_concat(categories.value ORDER BY categories.value SEPARATOR ' || ') AS categories
			FROM groups
			LEFT JOIN categories ON categories.groupid=groups.groupid
			GROUP BY groups.groupid
			ORDER BY groups.value, categories.value
		"""
		cursor.execute(sql)
		groupRows = cursor.fetchall()
		data = {
			"groups": groupRows
		}

	print("Content-Type: application/json\n\n")
	print(json.dumps(data))

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
