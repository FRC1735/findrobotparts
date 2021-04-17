#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb
import re
import urllib
import os
import json

import includes

cgitb.enable()
form = cgi.FieldStorage()

def errorOccurred(message) :
	print "Content-type: text/html\n\n"
	print "<h2>An error occured</h2>"
	print "<p>%s</p>" % message
	sys.exit(1)

product = form.getvalue("product")

if product is None or product not re.compile("^[a-z\-]+").match(product) :
	product = None
	errorOccurred("Product was not defined")

categories = form.getvalue("categories")
tags = form.getvalue("categories")

stringlist = re.compile("^[0-9,]+$")
if categories is None or tags is None or not stringlist.match(categories) or not stringlist.match(tags) :
	categories = None
	tags = None

#create database connection
try:
	conn = mdb.connect(host=includes.sqlh, db=includes.sqld, passwd=includes.sqlp, user=includes.sqlu)
	cursor = conn.cursor(mdb.cursors.DictCursor)
except mdb.Error, e:
	errorOccurred("Faild to connect to database<br>%d: %s" % (e.args[0], e.args[1]))

productId = None
sql = "SELECT * FROM groups WHERE pathname=%s" % conn.literal(product)
cursor.execute(sql)
if cursor.rowcount == 1 :
	productRow = cursor.fetchone()
	if not productRow["groupid"].isdigit() :
		errorOccurred("Product does not exist")
	productId = str(productRow["groupid"])
else :
	errorOccurred("Product does not exist")

sql = "SET @@group_concat_max_len = 2048"
cursor.execute(sql)

if tags is None or categories is None :
	sql = """\
		SELECT prodtable.productid, prodtable.name, prodtable.image, group_concat(prodtable.value ORDER BY prodtable.priority SEPARATOR '||') AS categories, group_concat(prodtable.tagvalue ORDER BY prodtable.priority SEPARATOR '||') AS tags, linklist.vendors, linklist.links
		FROM (
			SELECT 
			products.productid, products.name, products.image, tags.tagid, tags.categoryid, categories.value, categories.priority, group_concat(tags.value ORDER BY tags.value*1, tags.value SEPARATOR ', ') AS tagvalue
			FROM producttag 
			LEFT JOIN tags ON producttag.tagid = tags.tagid 
			LEFT JOIN products ON products.productid = producttag.productid
			LEFT JOIN categories ON categories.categoryid = tags.categoryid
			WHERE categories.groupid=%s
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
	""" % productId
else :
	sql = """\
		SELECT prodtable.productid, prodtable.name, prodtable.image, group_concat(prodtable.value ORDER BY prodtable.priority SEPARATOR '||') AS categories, group_concat(prodtable.tagvalue ORDER BY prodtable.priority SEPARATOR '||') AS tags, linklist.vendors, linklist.links
		FROM (
			SELECT 
			products.productid, products.name, products.image, tags.tagid, tags.categoryid, categories.value, categories.priority, group_concat(tags.value ORDER BY tags.value*1, tags.value SEPARATOR ', ') AS tagvalue
			FROM (
				SELECT productid FROM (
					SELECT productid
					FROM producttag
					LEFT JOIN tags ON producttag.tagid = tags.tagid
					WHERE producttag.tagid IN (%s)
					GROUP BY producttag.productid, tags.categoryid) AS a
				GROUP BY productid
				HAVING COUNT(productid) = %s) AS productids
			LEFT JOIN products ON productids.productid = products.productid
			LEFT JOIN producttag ON products.productid = producttag.productid
			LEFT JOIN tags ON producttag.tagid = tags.tagid 
			LEFT JOIN categories ON categories.categoryid = tags.categoryid
			WHERE categories.groupid=%s
			GROUP BY products.productid, tags.categoryid
		) AS prodtable
		LEFT JOIN (SELECT productid, group_concat(Vendor ORDER BY Vendor SEPARATOR '||') AS vendors, group_concat(link ORDER BY Vendor SEPARATOR '||') AS links FROM links GROUP BY productid) AS linklist ON prodtable.productid = linklist.productid
		GROUP BY productid
		ORDER BY prodtable.name
	""" % (tags, len(categories.split(",")), productId)

cursor.execute(sql)
productRows = cursor.fetchall()

sql = "SELECT categoryid, value FROM categories WHERE groupid=%s ORDER BY priority" % productId
cursor.execute(sql)
categoryRows = cursor.fetchall()

data = {
	"productid": productRow["groupid"],
	"title": productRow["value"],
	"pathname": productRow["pathname"],
	"description": productRow["description"],
	"imageslug": productRow["image"],
	"spreadsheet": productRow["spreadsheet"],
	"categories": categoryRows,
	"products": productRows
}

print "Content-Type: application/json\n\n"
print json.dumps(data)