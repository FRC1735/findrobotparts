#!/usr/bin/env python

import MySQLdb as mdb
import sys
import cgi
import cgitb
import re
import urllib
import os
import Cookie

import includes

cgitb.enable()
form = cgi.FieldStorage()
action = form.getvalue("action")
includes.cats = form.getvalue("cats")
includes.tags = form.getvalue("tags")
edit = form.getvalue("edit")

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
	includes.printFoot()
	sys.exit(1)
	
includes.printHead(None,cursor)

if 'HTTP_COOKIE' in os.environ:
	cookie_string = os.environ.get('HTTP_COOKIE')
	c = Cookie.SimpleCookie()
	c.load(cookie_string)
		
	try :
		data = c['frp'].value
	except KeyError :
		print "<p>Please log in</p>"
		includes.printFoot()
		sys.exit(1)

print """\
<ul>
	<li><a href="?action=multiple">Multiple</a></li>
	<li><a href="?action=single">Single</a></li> 
	<li><a href="?action=newgroup">New Group</a></li>
</ul>
"""


if form.getvalue("sqltype") == "newgroup" :
	sql = "INSERT INTO groups (value, description, image, pathname, spreadsheet) VALUES(%s, %s, %s, %s, %s)" % (conn.literal(form.getvalue("value")),conn.literal(form.getvalue("description")),conn.literal(form.getvalue("folder")),conn.literal(form.getvalue("pathname")),conn.literal(form.getvalue("spreadsheet")))
	#print sql
	cursor.execute(sql)
	newid = cursor.lastrowid
	
	categories = re.split(" ?\t ?", form.getvalue("categories"))
	for index, category in enumerate(categories) :
		sql = "INSERT INTO categories (groupid, value, priority) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(category), index+1)
		cursor.execute(sql)
		#print "<p>%s</p>" % sql
	conn.commit()
	print "<p>Successfully created group</p>"
elif form.getvalue("sqltype") == "multiple" :
	category = form.getvalue("cats")
	dryrun = form.getvalue("dryrun")
	
	if category is None :
		print "<p>Select a group</p>"
		includes.printFoot()
		sys.exit(1)
	
	tagids = []
	vendorloc = 0
	sql = "SELECT * FROM categories WHERE groupid=%s ORDER BY value" % conn.literal(category)
	cursor.execute(sql)
	rows = cursor.fetchall()
	for row in rows :
		tagids.append(row["categoryid"])
		if row["value"] == "Vendors" :
			vendorloc = len(tagids)
	
	tags = {}
	for catid in tagids :
		sql = "SELECT * FROM tags WHERE categoryid=%s" % conn.literal(catid)
		cursor.execute(sql)
		rows = cursor.fetchall()
		if not (catid in tags) :
			tags[catid] = {}
		for row in rows :
			tags[catid][row["value"]] = row["tagid"]
	
	data = form.getvalue("data")
	
	products = []
	for product in re.split("\r?\n", data) :
		productList = product.split("\t")
		for i in range(len(productList)) :
			if i != 0 and i < len(tagids)+1 :
				productList[i] = re.split(" ?, ?", productList[i])
		products.append(productList)
	
	for product in products :
		sql = "INSERT INTO products (name, image) VALUES(%s, %s)" % (conn.literal(product[0]), conn.literal(product[-1]))
		if dryrun :
			print "<p>%s</p>" % sql
		cursor.execute(sql)
		newid = cursor.lastrowid
		#newid = 18
		
		vendors = product[vendorloc]
		for i in range(len(vendors)) :
			sql = "INSERT INTO links (productid, vendor, link) VALUES (%s, %s, %s)" % (conn.literal(newid), conn.literal(vendors[i]), conn.literal(product[len(tagids)+i+1]))
			if dryrun :
				print "<p>%s</p>" % sql
			cursor.execute(sql)

		for i in range(1,len(tagids)+1) :
			for tag in product[i] :
				if tag not in tags[tagids[i-1]] :
					sql = "INSERT INTO tags (categoryid, value) VALUES (%s, %s)" % (conn.literal(tagids[i-1]), conn.literal(tag))
					if dryrun :
						print "<p>%s</p>" % sql
					cursor.execute(sql)
					tagvalue = cursor.lastrowid
					#tagvalue = 1735
					tags[tagids[i-1]][tag] = tagvalue
				else :
					tagvalue = tags[tagids[i-1]][tag]
				sql = "INSERT INTO producttag (productid, tagid) VALUES (%s, %s)" % (conn.literal(newid), conn.literal(tagvalue))
				if dryrun :
					print "<p>%s</p>" % sql
				cursor.execute(sql)
		if dryrun :
			print "<hr>"		

	if not dryrun :
		print "<p>Not Dry Run</p>"
		conn.commit()
	print "<p>Successfully created products</p>"
	
elif form.getvalue("sqltype") == "single":
	if form.getvalue("type") == "new" :
		sql = "INSERT INTO products (name, image) VALUES(%s, %s)" % (conn.literal(form.getvalue("name")), conn.literal(form.getvalue("image")))
		cursor.execute(sql)
		newid = cursor.lastrowid
		sql = "INSERT INTO links (productid, vendor, link) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(form.getvalue("vendor1")), conn.literal(form.getvalue("link1")))
		cursor.execute(sql)
		if form.getvalue("vendor2") is not None :
			sql = "INSERT INTO links (productid, vendor, link) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(form.getvalue("vendor2")), conn.literal(form.getvalue("link2")))
			cursor.execute(sql)
		if form.getvalue("vendor3") is not None :
			sql = "INSERT INTO links (productid, vendor, link) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(form.getvalue("vendor3")), conn.literal(form.getvalue("link3")))
			cursor.execute(sql)
		if form.getvalue("vendor4") is not None :
			sql = "INSERT INTO links (productid, vendor, link) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(form.getvalue("vendor4")), conn.literal(form.getvalue("link4")))
			cursor.execute(sql)
		if form.getvalue("vendor5") is not None :
			sql = "INSERT INTO links (productid, vendor, link) VALUES(%s, %s, %s)" % (conn.literal(newid), conn.literal(form.getvalue("vendor5")), conn.literal(form.getvalue("link5")))
			cursor.execute(sql)
		sql = ""
		for tag in form.getlist("tags") :
			if sql != "" :
				sql += ","
			sql += "(%s, %s)" % (conn.literal(newid), conn.literal(tag))
		sql = "INSERT INTO producttag (productid, tagid) VALUES %s" % sql
		cursor.execute(sql)
		conn.commit()
		print "successfully inserted"
	elif form.getvalue("editid") is not None :
		editid = form.getvalue("editid")
		sql = "UPDATE products SET name=%s, image=%s WHERE productid=%s" % (conn.literal(form.getvalue("name")), conn.literal(form.getvalue("image")), editid)
		cursor.execute(sql)
		for i in [1,2,3,4,5,6,7,8,9,10,11,12] :
			if form.getvalue("vendor%s" % i) is not None :
				if form.getvalue("linkid%s" % i) is not None :
					sql = "UPDATE links SET vendor=%s, link=%s WHERE linkid=%s" % (conn.literal(form.getvalue("vendor%s" % i)), conn.literal(form.getvalue("link%s" % i)), conn.literal(form.getvalue("linkid%s" % i)))
				else :
					sql = "INSERT INTO links (productid, vendor, link) VALUES(%s, %s, %s)" % (conn.literal(editid), conn.literal(form.getvalue("vendor%s" % i)), conn.literal(form.getvalue("link%s" % i)))
				cursor.execute(sql)
		sql = "DELETE FROM producttag WHERE productid=%s" % editid
		cursor.execute(sql)
		sql = ""
		for tag in form.getlist("tags") :
			if sql != "" :
				sql += ","
			sql += "(%s, %s)" % (conn.literal(editid), conn.literal(tag))
		sql = "INSERT INTO producttag (productid, tagid) VALUES %s" % sql
		cursor.execute(sql)
		conn.commit()
		print "UPDATED SUCCESSFULLY"


if action == "single" or edit is not None:
	product = { "name": "", "image":""}
	tags = []
	links = []

	if edit is not None :
		sql = "SELECT * FROM products WHERE productid = %s" % edit
		cursor.execute(sql)
		product = cursor.fetchall()[0]
	
		sql = "SELECT tagid FROM producttag WHERE productid = %s" % edit
		cursor.execute(sql)
		tagsrequest = cursor.fetchall()
		for tag in tagsrequest :
			tags.append(tag["tagid"])
	
		sql = "SELECT * FROM links WHERE productid = %s" % edit
		cursor.execute(sql)
		links = cursor.fetchall()
	print """\
	<div class="panel-group" id="tagaccordion">
	"""

	sql = """\
		SELECT groups.value AS groupvalue, products.productid, products.name, categories.groupid
		FROM `products`
		LEFT JOIN producttag ON producttag.productid = products.productid
		LEFT JOIN tags ON producttag.tagid = tags.tagid
		LEFT JOIN categories ON tags.categoryid = categories.categoryid
		LEFT JOIN groups ON groups.groupid=categories.groupid
		GROUP BY products.productid
		ORDER BY groups.value, categories.groupid, products.name"""
	cursor.execute(sql)
	rows = cursor.fetchall()
	lastgroup = 0
	for row in rows :
		if lastgroup != row["groupid"] :
			if lastgroup != 0 :
				print "</ul></div></div></div>"
			print """\
				<div class="panel panel-default">
					<div class="panel-heading">
					<h4 class='panel-title' data-toggle='collapse' data-parent='#tabaccordion' href='#tagging%s'>%s</h4>
					</div>
					<div id="tagging%s" class="panel-collapse collapse">
						<div class="panel-body">
							<ul>
			""" % (row["groupid"], row["groupvalue"], row["groupid"])
		print "<li><a href='/add.py?edit=%s#start'>%s</a></li>" % (row["productid"], row["name"])
		lastgroup = row["groupid"]
	print "</ul></div></div></div></div>"

	print """\

	<form method="post" action="/add.py" id="start">
		<input type="hidden" name="sqltype" value="single"/>
		<div class="form-group">
			<label for="name">Name</label>
			<input type="text" id="name" name="name" class="form-control" value='%s'>
		</div>
		<div class="form-group">
			<label for="image">Image</label>
			<input type="text" id="image" name="image" class="form-control" value="%s">
		</div>
	<h4>Links</h4>
	""" % (product["name"], product["image"])

	if edit is not None:
		print "<input type='hidden' name='editid' value='%s'/>" % edit
	else :
		print "<input type='hidden' name='type' value='new'>"


	for i in [0,1,2,3,4,5,6,7,8,9,10,11,12] :
		if i >= len(links) :
			vendor = ""
			link = ""
			linkid = ""
		else :
			vendor = links[i]["Vendor"]
			link = links[i]["link"]
			linkid = links[i]["linkid"]
		print """\
		<div class="row form-group">
			<input type="hidden" name="linkid%s" value="%s"/>
			<div class="col-sm-4">
				<input type="text" name="vendor%s" class="form-control" placeholder="Company Name" value="%s">
			</div>
			<div class="col-sm-8">
				<input type="text" name="link%s" class="form-control" placeholder="Product Link" value="%s">
			</div>
		</div>
		""" % (i+1, linkid, i+1, vendor, i+1, link)

	print """\
	<h4>Tags</h4>
	<div class="panel-group" id="tagaccordion">
	""" 

	sql = """
		SELECT groups.value AS groupvalue, categories.groupid, categories.value AS category, tags.tagid, tags.value as tag 
		FROM `tags` 
		LEFT JOIN categories ON tags.categoryid = categories.categoryid 
		LEFT JOIN groups ON categories.groupid = groups.groupid 
		ORDER BY groups.value, categories.groupid DESC, categories.value, tags.value*1, tags.value"""
	cursor.execute(sql)
	rows = cursor.fetchall()
	lastcat = ""
	lastgroup = 0
	for row in rows :
		if lastcat != row["category"] :
			if lastcat != "" :
				print "</div>"
			if lastgroup != row["groupid"] :
				if lastgroup != 0 :
					print "</div></div></div>"
				print """\
				<div class="panel panel-default">
					<div class="panel-heading">
					<h4 class='panel-title' data-toggle='collapse' data-parent='#tabaccordion' href='#ttagging%s'>%s</h4>
					</div>
					<div id="ttagging%s" class="panel-collapse collapse">
						<div class="panel-body">
					""" % (row["groupid"], row["groupvalue"], row["groupid"])
			print "<div class='col-sm-2'><label>%s</label>" % row["category"]
		checked = ""
		if row["tagid"] in tags :
			checked = " checked"
		print """\
		<div class="checkbox">
			<label>
				<input name="tags" type="checkbox" value="%s" %s> %s
			</label>
		</div>
		""" % (row["tagid"], checked, row["tag"])
		lastcat = row["category"]
		lastgroup = row["groupid"]


	print """\
	</div></div></div>
	</div>
	<button type="submit" class="btn btn-primary">Submit</button>
	</form>


	"""
elif action == "multiple" :
	sql = """\
		SELECT groups.groupid, groups.value AS groupname, group_concat(categories.value ORDER BY categories.value SEPARATOR ' || ') AS categories
		FROM groups
		LEFT JOIN categories ON categories.groupid=groups.groupid
		GROUP BY groups.groupid
		ORDER BY groups.value, categories.value
	"""
	cursor.execute(sql)
	rows = cursor.fetchall()
	lastgroup = 0

	print """\
	<form method="post" action="/add.py">
		<input type="hidden" name="sqltype" value="multiple"/>
		<div class="checkbox">
			<label>
				<input name="dryrun" type="checkbox" value="true"> Dry Run
			</label>
		</div>

	"""

	for row in rows :
		if lastgroup != row["groupid"] :
			print """\
			<div class="radio">
				<label>
					<input name="cats" type="radio" value="%s"> %s  -- <small>Product Name || %s || Link 1 || Link 2 || ... || Image URL</small>
				</label>
			</div>
			""" % (row["groupid"], row["groupname"], row["categories"])
	
	print """\
		<div class="form-group">
			<label for="name">Name</label>
			<textarea name="data" class="form-control" rows="20"></textarea>
		</div>
		<button type="submit" class="btn btn-primary">Submit</button>
	</form>
	"""
elif action=="newgroup" :
	print """\
	<form method="post" action="/add.py">
		<input type="hidden" name="sqltype" value="newgroup"/>
		<div class="form-group">
			<label for="value">Group Name</label>
			<input type="text" class="form-control" name="value">
		</div>
		<div class="form-group">
			<label for="categories">Categories</label>
			<input type="text" class="form-control" name="categories">
		</div>
		<div class="form-group">
			<label for="description">Description</label>
			<input type="text" class="form-control" name="description">
		</div>
		<div class="form-group">
			<label for="description">Image Filename (singular)</label>
			<input type="text" class="form-control" name="folder">
		</div>
		<div class="form-group">
			<label for="description">Image Folder (plural with dashes)</label>
			<input type="text" class="form-control" name="pathname">
		</div>
		<div class="form-group">
			<label for="description">Spreadsheet</label>
			<input type="text" class="form-control" name="spreadsheet">
		</div>

		<button type="submit" class="btn btn-primary">Submit</button>
	</form>	
	"""


includes.printFoot()