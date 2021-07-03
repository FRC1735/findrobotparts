this["FindRobotParts"] = this["FindRobotParts"] || {};
this["FindRobotParts"]["templates"] = this["FindRobotParts"]["templates"] || {};
this["FindRobotParts"]["templates"]["dashboardGroup"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<form id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":22}}}) : helper)))
    + "Form\">\n\n	<div class=\"form-floating mb-3\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":4,"column":46},"end":{"line":4,"column":58}}}) : helper)))
    + "GroupName\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":5,"column":14},"end":{"line":5,"column":26}}}) : helper)))
    + "GroupName\">Group Name</label>\n	</div>\n\n	<div class=\"form-floating mb-3\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":9,"column":46},"end":{"line":9,"column":58}}}) : helper)))
    + "Categories\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":10,"column":14},"end":{"line":10,"column":26}}}) : helper)))
    + "Categories\">Categories (tab deliminated)</label>\n	</div>\n\n	<div class=\"form-floating mb-3\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":14,"column":46},"end":{"line":14,"column":58}}}) : helper)))
    + "Description\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":15,"column":14},"end":{"line":15,"column":26}}}) : helper)))
    + "Description\">Description</label>\n	</div>\n\n	<div class=\"form-floating mb-3\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":19,"column":46},"end":{"line":19,"column":58}}}) : helper)))
    + "ImageFilename\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":20,"column":14},"end":{"line":20,"column":26}}}) : helper)))
    + "ImageFilename\">Image Filename (singular)</label>\n	</div>\n\n	<div class=\"form-floating mb-3\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":24,"column":46},"end":{"line":24,"column":58}}}) : helper)))
    + "ImageFolder\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":25,"column":14},"end":{"line":25,"column":26}}}) : helper)))
    + "ImageFolder\">Image Folder (plural with dashes)</label>\n	</div>\n\n	<div class=\"form-floating mb-3\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":29,"column":46},"end":{"line":29,"column":58}}}) : helper)))
    + "Spreadsheet\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":30,"column":14},"end":{"line":30,"column":26}}}) : helper)))
    + "Spreadsheet\">Spreadsheet</label>\n	</div>\n\n	<button type=\"submit\" class=\"btn btn-green\">Submit</button>\n</form>";
},"useData":true});
this["FindRobotParts"]["templates"]["dashboardMultiple"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<option value=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"groupid") : depth0), depth0))
    + "\" data-categories=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"categories") : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"value") : depth0), depth0))
    + "</option>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<form id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":22}}}) : helper)))
    + "Form\">\n	<div class=\"form-floating mb-3\">\n		<select class=\"form-select\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":3,"column":34},"end":{"line":3,"column":46}}}) : helper)))
    + "ProductGroup\">\n			<option selected>Select a Group</option>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"groups") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":3},"end":{"line":7,"column":12}}})) != null ? stack1 : "")
    + "		</select>\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":9,"column":14},"end":{"line":9,"column":26}}}) : helper)))
    + "ProductGroup\">Product Group</label>\n	</div>\n\n	<div class=\"form-floating\">\n		<textarea class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":13,"column":37},"end":{"line":13,"column":49}}}) : helper)))
    + "Data\" style=\"height: 300px\"></textarea>\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":14,"column":14},"end":{"line":14,"column":26}}}) : helper)))
    + "Data\"></label>\n	</div>\n\n	<button type=\"submit\" class=\"btn btn-green\">Submit</button>\n</form>";
},"useData":true});
this["FindRobotParts"]["templates"]["dashboardProductOption"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<option value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"productid") || (depth0 != null ? lookupProperty(depth0,"productid") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productid","hash":{},"data":data,"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":29}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":31},"end":{"line":3,"column":39}}}) : helper)))
    + "</option>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<option>Select a Product</option>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"products") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":9}}})) != null ? stack1 : "");
},"useData":true});
this["FindRobotParts"]["templates"]["dashboardSingle"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<option value=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"pathname") : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"value") : depth0), depth0))
    + "</option>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<form id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":22}}}) : helper)))
    + "Form\">\n	<div class=\"form-floating mb-3\">\n		<select class=\"form-select\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":3,"column":34},"end":{"line":3,"column":46}}}) : helper)))
    + "ProductGroup\">\n			<option selected>Select a Group</option>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"groups") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":3},"end":{"line":7,"column":12}}})) != null ? stack1 : "")
    + "		</select>\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":9,"column":14},"end":{"line":9,"column":26}}}) : helper)))
    + "ProductGroup\">Product Group</label>\n	</div>\n\n	<div class=\"form-floating mb-3 editOnly productSelection\" style=\"display:none;\">\n		<select class=\"form-select\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":13,"column":34},"end":{"line":13,"column":46}}}) : helper)))
    + "Product\">\n		</select>\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":15,"column":14},"end":{"line":15,"column":26}}}) : helper)))
    + "Product\">Product</label>\n	</div>\n\n	<div class=\"form-floating mb-3 editOption\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":19,"column":46},"end":{"line":19,"column":58}}}) : helper)))
    + "ProductName\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":20,"column":14},"end":{"line":20,"column":26}}}) : helper)))
    + "ProductName\">Product Name</label>\n	</div>\n\n	<div class=\"form-floating mb-3 editOption\">\n		<input type=\"text\" class=\"form-control\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":24,"column":46},"end":{"line":24,"column":58}}}) : helper)))
    + "ImagePath\">\n		<label for=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":25,"column":14},"end":{"line":25,"column":26}}}) : helper)))
    + "ImagePath\">Image Path</label>\n	</div>\n\n	"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"vendorLinks") || (depth0 != null ? lookupProperty(depth0,"vendorLinks") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"vendorLinks","hash":{},"data":data,"loc":{"start":{"line":28,"column":1},"end":{"line":28,"column":18}}}) : helper))) != null ? stack1 : "")
    + "	\n\n	<button type=\"submit\" class=\"btn btn-green editOption\">Submit</button>\n</form>";
},"useData":true});
this["FindRobotParts"]["templates"]["dashboardVendorLinks"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<div class=\"row mb-3 vendor-links editOption\">\n		<div class=\"col form-floating\">\n			<input type=\"text\" class=\"form-control vendor-name\" id=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"idPrefix") : depths[1]), depth0))
    + "VendorName"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":6,"column":84},"end":{"line":6,"column":94}}}) : helper)))
    + "\" value=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\">\n			<label for=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"idPrefix") : depths[1]), depth0))
    + "VendorName"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":7,"column":40},"end":{"line":7,"column":50}}}) : helper)))
    + "\">Vendor Name</label>\n		</div>\n		<div class=\"col form-floating\">\n			<input type=\"text\" class=\"form-control vendor-link\" id=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"idPrefix") : depths[1]), depth0))
    + "VendorLink"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":10,"column":84},"end":{"line":10,"column":94}}}) : helper)))
    + "\" value=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"link") : depth0), depth0))
    + "\">\n			<label for=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"idPrefix") : depths[1]), depth0))
    + "VendorLink"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":11,"column":40},"end":{"line":11,"column":50}}}) : helper)))
    + "\">Vendor Link</label>\n		</div>\n	</div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p class=\"h4 editOption\">Vendor Links</p>\n<div id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"idPrefix") || (depth0 != null ? lookupProperty(depth0,"idPrefix") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"idPrefix","hash":{},"data":data,"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":21}}}) : helper)))
    + "VendorLinks\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"vendorLinks") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":1},"end":{"line":14,"column":10}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useDepths":true});
this["FindRobotParts"]["templates"]["productrow"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<td data-label="
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"category") : depth0), depth0))
    + ">\n		<div class=\"tags collapse\" id=\"collapse"
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"productid") : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":8,"column":58},"end":{"line":8,"column":68}}}) : helper)))
    + "\">\n			"
    + ((stack1 = alias1((depth0 != null ? lookupProperty(depth0,"tag") : depth0), depth0)) != null ? stack1 : "")
    + "\n		</div>\n		<a class=\"showmore collapsed d-none\" data-bs-toggle=\"collapse\" href=\"#collapse"
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"productid") : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":11,"column":97},"end":{"line":11,"column":107}}}) : helper)))
    + "\" aria-expanded=\"false\" aria-controls=\"collapse"
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"productid") : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":11,"column":171},"end":{"line":11,"column":181}}}) : helper)))
    + "\">\n			Show <span class=\"more\">more</span> <span class=\"less\">less</span>\n		</a>\n	</td>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<a href=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"link") : depth0), depth0))
    + "\" class=\"list-group-item list-group-item-action list-group-item-green\" target=\"_blank\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"vendor") : depth0), depth0))
    + "</a>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr data-tags=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"tagids") || (depth0 != null ? lookupProperty(depth0,"tagids") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tagids","hash":{},"data":data,"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":25}}}) : helper)))
    + "\">\n	<th scope=\"row\" data-label=\"Product\">\n		<strong>"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":18}}}) : helper)))
    + "</strong><br>\n		<img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"image") || (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data,"loc":{"start":{"line":4,"column":12},"end":{"line":4,"column":21}}}) : helper)))
    + "\" class=\"img-thumbnail\" alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":4,"column":50},"end":{"line":4,"column":58}}}) : helper)))
    + "\">\n	</th>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"categories") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":1},"end":{"line":15,"column":10}}})) != null ? stack1 : "")
    + "	<td data-label=\"Vendors\">\n		<div class=\"list-group\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"links") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":3},"end":{"line":20,"column":12}}})) != null ? stack1 : "")
    + "		</div>\n	</td>\n</tr>\n";
},"useData":true,"useDepths":true});
this["FindRobotParts"]["templates"]["productrowheader"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "		<th>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</th>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<thead>\n	<tr>\n		<th scope=\"col\">Product</td>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"categories") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":2},"end":{"line":6,"column":11}}})) != null ? stack1 : "")
    + "	</tr>\n</thead>\n";
},"useData":true});
this["FindRobotParts"]["templates"]["taggroup"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression, alias2=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "		<input type=\"checkbox\" class=\"btn-check\" name=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"categoryid") || (data && lookupProperty(data,"categoryid"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"categoryid","hash":{},"data":data,"loc":{"start":{"line":5,"column":49},"end":{"line":5,"column":64}}}) : helper)))
    + "\" id=\"tag"
    + alias1(alias2((depth0 != null ? lookupProperty(depth0,"tagid") : depth0), depth0))
    + "\" value=\""
    + alias1(alias2((depth0 != null ? lookupProperty(depth0,"tagid") : depth0), depth0))
    + "\" autocomplete=\"off\">\n		<label class=\"btn btn-outline-green\" for=\"tag"
    + alias1(alias2((depth0 != null ? lookupProperty(depth0,"tagid") : depth0), depth0))
    + "\">"
    + alias1(alias2((depth0 != null ? lookupProperty(depth0,"value") : depth0), depth0))
    + "</label>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"col-6 col-sm-12\">\n	<p class=\"h6 mt-4\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":29}}}) : helper)))
    + "</p>\n	<div class=\"btn-group-vertical btn-group-sm full-width\" role=\"group\" aria-label=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":3,"column":82},"end":{"line":3,"column":91}}}) : helper)))
    + " options\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"tags") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":1},"end":{"line":7,"column":10}}})) != null ? stack1 : "")
    + "		<button type=\"button\" class=\"btn btn-outline-green\">Show <span class=\"all\">All</span><span class=\"less\">Less</span></button>\n	</div>\n</div>";
},"useData":true});