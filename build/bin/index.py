#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb

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

	if actionname is not None :
		sql = "SELECT * FROM groups WHERE pathname=%s" % conn.literal(actionname)
		cursor.execute(sql)
		if cursor.rowcount == 1 :
			row = cursor.fetchone()
			action = str(row["groupid"])
			title = row["value"] + " -  "
			maincontent = createHeader(row)
			hasSidebar = True
		else :
			action = None

	if title == "" :
		maincontent = open("../content/homepage.html").read()

#	if action is None :
#		print open("main.inc").read()
#	#elif action == "faq" :
#	#	print open("faq.inc").read()
#	#elif action == "404err" :
#	#	print open("404.inc").read()
	outputhtml = outputhtml.replace("{{title}}", title)
	outputhtml = outputhtml.replace("{{maincontent}}", maincontent)
	sidebarview = "block"
	if (not hasSidebar) :
		sidebarview = "none"
	outputhtml = outputhtml.replace("{{sidebarview}}", sidebarview)
	print("Content-type: text/html\n\n")
	print(outputhtml)

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
