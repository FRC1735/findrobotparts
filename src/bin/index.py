#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb
import traceback
import os
import Cookie

sys.path.append("../../")
import config

cgitb.enable()
form = cgi.FieldStorage()

action = form.getvalue("action")
actionname = form.getvalue("actionname")

#create database connection
try:
	conn = mdb.connect(host=config.sqlh, db=config.sqld, passwd=config.sqlp, user=config.sqlu)
	cursor = conn.cursor(mdb.cursors.DictCursor)
except mdb.Error, e:
	print("Content-type: text/html\n\n")
	print("<h2>Error</h2>")
	print("Error %d: %s" % (e.args[0], e.args[1]))
	sys.exit(1)

def createHeader(row) :
	producthtml = open("../content/product.html").read()
	producthtml = producthtml.replace("{{image}}", row["image"])
	producthtml = producthtml.replace("{{value}}", row["value"])
	producthtml = producthtml.replace("{{spreadsheet}}", row["spreadsheet"])
	producthtml = producthtml.replace("{{description}}", row["description"])
	producthtml = producthtml.replace("{{pathname}}", row["pathname"])
	return producthtml

try:
	title = ""
	maincontent = ""
	hasSidebar = False
	outputhtml = open("../content/template.html").read()
	admin = False

	if action == "admin" :
		if 'HTTP_COOKIE' in os.environ:
			cookie_string = os.environ.get('HTTP_COOKIE')
			c = Cookie.SimpleCookie()
			c.load(cookie_string)
				
			try :
				data = c['frp'].value
				admin = True
				title = "Dashboard"
				maincontent = open("../content/dashboard.html").read()
				hasSidebar = True
			except KeyError :
				title = "403 - Part Denied"
				maincontent = open("../content/404.html").read()
		else :
			title = "403 - Part Denied"
			maincontent = open("../content/404.html").read()
	elif action == "about" :
		title = "About"
		maincontent = open("../content/about.html").read()
	elif action == "404err" :
		title = "404 - Part Not Found"
		maincontent = open("../content/404.html").read()
	elif action == "home" :
		maincontent = open("../content/homepage.html").read()
	elif actionname is not None :
		sql = "SELECT * FROM groups WHERE pathname=%s" % conn.literal(actionname)
		cursor.execute(sql)
		if cursor.rowcount == 1 :
			row = cursor.fetchone()
			action = str(row["groupid"])
			title = row["value"] + " -  "
			maincontent = createHeader(row)
			hasSidebar = True
		else :
			title = "404 - Part Not Found"
			maincontent = open("../content/404.html").read()
	else :
		title = "404 - Part Not Found"
		maincontent = open("../content/404.html").read()

	outputhtml = outputhtml.replace("{{title}}", title)
	outputhtml = outputhtml.replace("{{maincontent}}", maincontent)
	sidebarview = "block"
	if not hasSidebar :
		sidebarview = "none"
	outputhtml = outputhtml.replace("{{sidebarview}}", sidebarview)
	if admin :
		outputhtml = outputhtml.replace("robotparts.js", "robotparts-admin.js")
	print("Content-type: text/html\n\n")
	print(outputhtml)

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
