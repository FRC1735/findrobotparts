#!/usr/bin/env python

import MySQLdb as mdb
import sys
import json
import cgi
import cgitb
import traceback
import os
import Cookie

sys.path.append("../../")
import config

cgitb.enable()
form = cgi.FieldStorage()

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
		outputhtml = json.load(sys.stdin)

	print("Content-type: text/html\n\n")
	print(outputhtml)

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
