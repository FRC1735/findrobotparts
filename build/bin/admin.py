#!/usr/bin/env python

import MySQLdb as mdb
import sys
import json
import cgitb
import traceback
import os
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
		data = json.load(sys.stdin.read(int(os.environ.get('CONTENT_LENGTH', 0))))
		if data.type == "addSingle" :
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

	print("Content-type: text/html\n\n")
	print(outputhtml)

except Exception :
	print("Content-type: text/html\n\n")
	print("<pre>%s</pre>" % traceback.format_exc())
