import cgitb
import cgi
import math
import config

sqlh = config.sqlh
sqlu = config.sqlu
sqld = config.sqld
sqlp = config.sqlp

cats = ""
tags = ""

pathName = None
sectionName = None

def getPathName(actionid, cursor) :
	global pathName, sectionName
	if pathName is not None:
		return pathName
	else :
		sql = "SELECT * FROM groups WHERE groupid=%s" % int(actionid)
		cursor.execute(sql)
		rows = cursor.fetchall()
		for row in rows :
			pathName = row["pathname"]
			sectionName = row["value"]
		return pathName

def getSectionName(sectionid, cursor) :
	global sectionName, pathName
	if sectionName is not None : 
		return sectionName
	else :
		sql = "SELECT * FROM groups WHERE groupid=%s" % int(actionid)
		cursor.execute(sql)
		rows = cursor.fetchall()
		for row in rows :
			pathName = row["pathname"]
			sectionName = row["value"]
		return sectionName

def printSidebarLink(action, cursor, tagid, categoryid, cvalue, tvalue) :
	currenttag = isCurrentTag(tagid)
	newCats = getNewCats(tagid, categoryid, cursor)
	newTags = getNewTags(tagid)
	if newCats != "" and newTags != "" :
		return "<a href='/%s/categories/%s/tags/%s' class='%s'><span class='glyphicon glyphicon-none'></span><span class='glyphicon glyphicon-plus'></span><span class='glyphicon glyphicon-ok'></span><span class='glyphicon glyphicon-remove'></span> %s</a>" % (getPathName(action, cursor), newCats, newTags, "tag-remove" if currenttag else "tag-add", tvalue)
	else :
		return "<a href='/%s/' class='%s'><span class='glyphicon glyphicon-none'></span><span class='glyphicon glyphicon-plus'></span><span class='glyphicon glyphicon-ok'></span><span class='glyphicon glyphicon-remove'></span> %s</a>" % (getPathName(action, cursor), "tag-remove" if currenttag else "tag-add", tvalue)				


def printHead(action, cursor):
	print "Content-type: text/html\n\n"
	print open("header.inc").read()
	path = "http://findrobotparts.com/"
	section = None
	if action is not None and action.isdigit() :
		path = "http://findrobotparts.com/%s/" % getPathName(action, cursor)
		section = getSectionName(action, cursor)
	print "<link rel='canonical' href='%s' />" % path
	if section :
		print "<title>%s - Find Robot Parts</title>" % section
	else :
		print "<title>Find Robot Parts</title>"
	print open("header2.inc").read()
	if action is not None and action.isdigit() :
		sql = "SELECT categories.categoryid, categories.value AS cvalue, tags.tagid, tags.value AS tvalue FROM categories LEFT JOIN tags ON categories.categoryid = tags.categoryid WHERE categories.groupid = %s ORDER BY categories.priority, tags.value*1, tags.value" % action
		cursor.execute(sql)
		rows = cursor.fetchall()
		html = ""
		lastsection = ""
		for row in rows :
			if lastsection != row["cvalue"] :
				if lastsection == "Reduction" :
					sql = "SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(value, ':', 1), '.', 1) AS firstnum, group_concat(tagid SEPARATOR ',') AS tags FROM `tags` WHERE categoryid=1 GROUP BY firstnum ORDER BY value*1"
					cursor.execute(sql)
					rows2 = cursor.fetchall()
					html += "<div class='row'><div class='col-xs-6'>"
					for index, row2 in enumerate(rows2) :
						if index == math.floor(len(rows2)/2) : 
							html += "</div><div class='col-xs-6'>"
						if row2["firstnum"] == "1" :
							html += printSidebarLink(action, cursor, row2["tags"], "1", "Reduction", "1:1.*")
						else :
							html += printSidebarLink(action, cursor, row2["tags"], "1", "Reduction", "%s.*:1" % row2["firstnum"] )
					html += "</div></div>"
				if lastsection != '' :
					html += "</div>"
				currentCat = ""
				if isCurrentCat(row["categoryid"]) :
					currentCat = "currentcategory"
				html += """\
					<h3 data-toggle="collapse" data-target="#cat%s" class="collapsetitle collapsed %s">
						<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
						<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
						%s
					</h3>
					<div id="cat%s" class="collapse collapselist">
				""" % (row["categoryid"], currentCat, row["cvalue"], row["categoryid"])
			if row["categoryid"] != 1 :
				html += printSidebarLink(action, cursor, row["tagid"], row["categoryid"], row["cvalue"], row["tvalue"])
			lastsection = row["cvalue"]
		if html != "" :
			html += "</div>"
			print '<h2><span class="glyphicon glyphicon-filter"></span>Filter</h2>'
			if tags :
				print '<p><a href="/%s"><span class="glyphicon glyphicon-remove"></span> Clear filter(s)</a></p>' % pathName
			print html
		#print "<div class='row'>%s</div>" % html
	print open("middle.inc").read()

def printFoot():
	print open("footer.inc").read()
	
def isCurrentCat(categoryid) :
	if cats is not None:
		if str(categoryid) in cats.split(",") :
			return True
	return False

def isCurrentTag(tagid) :
	if tags is not None:
		if str(tagid) in tags.split(",") :
			return True
		elif len(str(tagid).split(",")) > 1 and set(str(tagid).split(",")).issubset(tags.split(",")) :
			return True
	return False

def getNewTags(tagid) :
	if tags is not None :
		tagList = tags.split(",")
		if str(tagid) in tagList :
			tagList.remove(str(tagid))
			return ",".join(tagList)
		elif len(str(tagid).split(",")) > 1 and set(str(tagid).split(",")).issubset(tagList) :
			for tag in str(tagid).split(",") :
				tagList.remove(str(tag))
			return ",".join(tagList)
		else :
			tagList.append(str(tagid))
			tagList.sort()
			return ",".join(tagList)
	return tagid

def getNewCats(tagid, catid, cursor) :
	if cats is not None :
		catList = cats.split(",")
		if str(catid) in catList :
			tagList = tags.split(",")
			if str(tagid) in tagList :
				sql = "SELECT * FROM tags WHERE categoryid = %s AND tagid IN (%s)" % (catid, tags)
				cursor.execute(sql)
				rows2 = cursor.fetchall()
				if len(rows2) > 1 :
					return cats
				else :
					catList.remove(str(catid))
					return ",".join(catList)
			elif len(str(tagid).split(",")) > 1 and set(str(tagid).split(",")).issubset(tagList) :
				sql = "SELECT * FROM tags WHERE categoryid = %s AND tagid IN (%s)" % (catid, tags)
				cursor.execute(sql)
				rows2 = cursor.fetchall()
				if len(rows2) >  len(str(tagid).split(",")) :
					return cats
				else :
					catList.remove(str(catid))
					return ",".join(catList)
			else :
				return cats
		else :
			catList.append(str(catid))
			catList.sort()
			return ",".join(catList)
	return catid	

def getLinks(tagVendors, vendorNames, vendorLinks) :
	vendorNamesList = vendorNames.split("||")
	vendorLinksList = vendorLinks.split("||")
	html = ""
	for i in range(len(vendorNamesList)) :
		html += "<a class='btn btn-sm btn-%s' href='%s' role='button' target='_blank'>%s</a>" % (vendorNamesList[i].replace(" ", ""), vendorLinksList[i], vendorNamesList[i])
	return html