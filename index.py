#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb
import re
import urllib
import os

import includes

cgitb.enable()
form = cgi.FieldStorage()

action = form.getvalue("action")
actionname = form.getvalue("actionname")
includes.cats = form.getvalue("cats")
includes.tags = form.getvalue("tags")

stringlist = re.compile("^[0-9,]+$")
if includes.cats is None or includes.tags is None or not stringlist.match(includes.cats) or not stringlist.match(includes.tags) :
	includes.cats = None
	includes.tags = None

#create database connection
try:
	conn = mdb.connect(host=includes.sqlh, db=includes.sqld, passwd=includes.sqlp, user=includes.sqlu)
	cursor = conn.cursor(mdb.cursors.DictCursor)
except mdb.Error, e:
	print "<h2>Error</h2>"
	print "Error %d: %s" % (e.args[0], e.args[1])
	sys.exit(1)

def printTable(action, categories, rows) :
	print """\
		<table class="table table-striped table-collapse">
			<thead>
				<tr>
	"""
	if action != "7" :
		print "<th>Product</th>"
	else :
		print "<th>Vendor</th>"
	for category in categories :
		if (category["value"] != "Vendors") :
			print "<th>%s</th>" % category["value"]
	if action != "7" :
		print "<th>Vendor(s)</th>"
	else :
		print "<th>Website</th>"
	print "</tr></thead><tbody>"

	for row in rows :
		print "<tr><td><strong>%s</strong><br><img src='%s' width='100' alt='%s'></td>" % (row["name"], row["image"], row["name"])
		for idx, tag in enumerate(row["tags"].split("||")) :
			if idx != len(categories) - 1 or action == "7" :
				print "<td>%s</td>" % tag
		print "<td>%s</td>" % includes.getLinks("", row["vendors"], row["links"])
		print "</tr>"
	
	print "</tbody></table>"
	
if actionname is not None :
	sql = "SELECT * FROM groups WHERE pathname=%s" % conn.literal(actionname)
	cursor.execute(sql)
	if cursor.rowcount == 1 :
		row = cursor.fetchone()
		action = str(row["groupid"])
	else :
		action = None

includes.printHead(action,cursor) 
	

if action is None :
	print open("main.inc").read()
elif action == "pnu" :
	print open("pneu.inc").read()
elif action == "faq" :
	print open("faq.inc").read()
elif action == "404err" :
	print open("404.inc").read()
elif action.isdigit() :
	sql = "SELECT value, description, image, spreadsheet FROM groups WHERE groupid=%s" % action
	cursor.execute(sql)
	rows = cursor.fetchall()

	print """\
	<div class="row" class="margin-bottom: 30px;">
		<div class="col-12 col-sm-2 hidden-xs">
			<img src="/images/categories/%s-gray.jpg" alt="%s" class="rounded-circle" width="100%%">
		</div>
		<div class="col-12 col-sm-8">
			<h1 class='page-header'>
				<span>%s</span> 
				<a href="%s" class="btn btn-success" target="_blank" data-toggle="tooltip" data-placement="bottom" title="We try our best to include everything we know about as accurately as possible. If you find an error or know something is missing please let us know by updating this spreadsheet">Add / Edit this List</a>
			</h1>
			%s
			<p><strong>Important:</strong> It is up to you to verify the part you want to use fits within the rules.</p>
		</div>
		<div class="col-12 col-sm-2 hidden-xs">
			<a href="http://www.firstnac.org" target="_blank">
				<img src="/images/nac-log.png" alt="FIRST National Advocacy Group" class="img-fluid">
			</a>
			<p><small>Your opportunity to make a difference in our future!</small></p>
		</div>
	</div>
	""" % (rows[0]["image"], rows[0]["value"], rows[0]["value"], rows[0]["spreadsheet"], rows[0]["description"])

	sql = "SET @@group_concat_max_len = 2048"
	cursor.execute(sql)

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
		LEFT JOIN (SELECT productid, group_concat(Vendor ORDER BY Vendor SEPARATOR '||') AS vendors, group_concat(link ORDER BY Vendor SEPARATOR '||') AS links FROM links GROUP BY productid) AS linklist ON prodtable.productid = linklist.productid
		GROUP BY productid
		ORDER BY prodtable.name
	""" % action
	
	if includes.tags is not None and includes.cats is not None:
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
		""" % (includes.tags, len(includes.cats.split(",")), action)
	cursor.execute(sql)
	productRows = cursor.fetchall()
	
	sql = "SELECT * FROM categories WHERE groupid=%s ORDER BY priority" % action
	cursor.execute(sql)
	categoryRows = cursor.fetchall()
	
	printTable(action, categoryRows, productRows)
	
includes.printFoot()

