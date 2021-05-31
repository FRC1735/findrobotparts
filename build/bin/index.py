#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb

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
	return """\
		<div class="row mb-2">
			<div class="col-12 col-sm-3 col-lg-2 d-none d-sm-block">
				<img src="/images/categories/{image}-gray.jpg" alt="{value}" class="img-thumbnail" width="100%%">
			</div>
			<div class="col-12 col-sm-9 col-lg-10">
				<h1 class="mb-0">{value}</h1>
				<p class="small"><em><a href="{spreadsheet}" target="_new">Suggest a change or new item</a></em></p>
				{description}
			</div>
		</div>
		""".format(image = row["image"], value = row["value"], spreadsheet = row["spreadsheet"], description = row["description"])

try:
	title = ""
	maincontent = ""
	leftsidebar = ""
	outputhtml = open("../content/template.html").read()

	if actionname is not None :
		sql = "SELECT * FROM groups WHERE pathname=%s" % conn.literal(actionname)
		cursor.execute(sql)
		if cursor.rowcount == 1 :
			row = cursor.fetchone()
			action = str(row["groupid"])
			title = row["value"] + " -  "
			maincontent = createHeader(row)
		else :
			action = None

#	if action is None :
#		print open("main.inc").read()
#	#elif action == "faq" :
#	#	print open("faq.inc").read()
#	#elif action == "404err" :
#	#	print open("404.inc").read()
	outputhtml = outputhtml.replace("{{title}}", title)
	outputhtml = outputhtml.replace("{{maincontent}}", maincontent)
	print("Content-type: text/html\n\n")
	print(outputhtml)

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
