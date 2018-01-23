			<footer>
				<p>Created and maintained by FIRST Robotics Team 1735, The Green Reapers, from Worcester, MA</p>
			</footer>
        </div>
      </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

	<!-- Latest compiled and minified JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
	<script src="/js/robotparts.js"></script>


	<script>
	
	//Polyfill to support endsWith
	if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function(searchString, position) {
	      var subjectString = this.toString();
	      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
	        position = subjectString.length;
	      }
	      position -= searchString.length;
	      var lastIndex = subjectString.indexOf(searchString, position);
	      return lastIndex !== -1 && lastIndex === position;
	  };
	}
	
	
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-72980745-1', 'auto');
	  ga('send', 'pageview');

		var trackOutboundLink = function(url) {
		   ga('send', 'event', 'outbound', 'click', url, {
		     'transport': 'beacon',
		     'hitCallback': function(){document.location = url;}
		   });
		}

		$(document).ready(function() {
			$("a.btn-sm").on("click", function() {
				folder = $("h1 span").text().toLowerCase();
				ga('send', 'event', 'outbound', folder, $(this).attr("href"), {
					'transport': 'beacon',
					'hitCallback': function(){document.location = url;}
				});
			});
		});

	</script>

  </body>
</html>
