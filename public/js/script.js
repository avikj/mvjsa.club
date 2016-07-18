$(document).ready(function(){
	$('select').material_select();

	$("nav.home-nav ul li a").click(function(e) {
		e.preventDefault();
		var $href = $(this).attr("href");
		
		$(".show").fadeToggle(
			250,
			function() {
				$($href).fadeToggle(250);
				$(".show").removeClass("show");
				$($href).addClass("show");
			}
		);
		$(".current-item").removeClass("current-item");
		$(this).parent().addClass("current-item");
		return false;
		/*var $href = $(this).attr("href");
		$(".show").removeClass("show");
		$($href).addClass("show");*/
	});

	function getFormErrors(fname,lname,password,confirmPassword,grade,email,dob1,dob2,dob3,phone1,phone2,phone3,sid,gender) {
		var isvalid = true;
		
		var numericExpression = /^[0-9]+$/;
		var emailExp = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if(fname == "" || lname == "" || password == "" || email == "" || dob1 == "" || dob2 == "" || dob3 == "" || phone1 == "" || phone2 == "" || phone3 == "" || sid == "")
			return "Please fill out all form fields.";
		else if(phone1.length < 3 || phone2.length < 3 || phone3.length < 4 || !phone1.match(numericExpression) || !phone2.match(numericExpression) || !phone3.match(numericExpression))
			return "Invalid phone number.";
		else if(!dob1.match(numericExpression) || !dob2.match(numericExpression) || !dob3.match(numericExpression) || dob1.length < 2 || dob2.length < 2 || dob3.length < 2 || dob1 < 1 || dob1 > 12 || dob2 < 1 || dob2 > 31 || dob3 < 90)
			return "Please enter your actual birthday.";
		else if(!email.match(emailExp))
			return "Invalid email address.";
		else if(!sid.match(numericExpression))
			return "Invalid Student ID."
		else if(password.length < 8)
			return "Your password must be at least 8 characters in length.";
		else if(password != confirmPassword)
			return "Passwords don't match."
		return null;
	}

	$("form#registration-form").submit(function(e) {
		e.preventDefault();
		$("body").css("cursor", "progress");
		$("input[type=submit]").attr("disabled", "disabled");
		
		var fname = $("#fname").val();
		var lname = $("#lname").val();
		var password = $("#password").val();
		var confirmPassword = $('#confirm-password').val();
		var grade = $("#grade").val();
		var gender = $('#gender').val();
		var email = $("#email").val();
		var dob1 = $("#dob1").val();
		var dob2 = $("#dob2").val();
		var dob3 = $("#dob3").val();
		var phone1 = $("#phone1").val();
		var phone2 = $("#phone2").val();
		var phone3 = $("#phone3").val();
		var sid = $("#sid").val();
		
		var successful = false;
		var formErrors = getFormErrors(fname,lname,password,confirmPassword,grade,email,dob1,dob2,dob3,phone1,phone2,phone3,sid,gender);
		if(!formErrors) {
			var dob = dob1+"/"+dob2+"/"+dob3;
			var phone = "("+phone1+") "+phone2+"-"+phone3;
			var action = $(this).attr("action");
			$.post(
				action,
				{
					'fname': fname,
					'lname': lname,
					'password': password,
					'grade': grade,
					'email': email,
					'dob': dob,
					'phone': phone,
					'sid': sid,
					'gender': gender
				},
				function(data) {
					var formalert;
					if(data=="success") {
						window.location.replace("/members");
					}
					else if(data=="registered") {
						formalert = "<span class='materialize-red-text text-lighten-2'>Member already registered.</span>";
						$("input[type=submit]").removeAttr("disabled");
					}
					else if(data=="failure") {
						formalert = "Registration Error";
						$("input[type=submit]").removeAttr("disabled");
					}
					if(formalert){
						Materialize.toast(formalert, 2000);
					}
				}
			);
		}
		else {
			Materialize.toast(formErrors, 2000);
			$("input[type=submit]").removeAttr("disabled");
		}
		
		$("body").css("cursor", "auto");
		return false;
	});

	function validateLogin(email,password) {
		var isvalid = true;
		
		var emailExp = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if(email == "" || password == "")
			isvalid = false;
		else if(!email.match(emailExp))
			isvalid = false;
		return isvalid;
	}

	$("form#login-form").submit(function(e) {
		e.preventDefault();
		$("body").css("cursor", "progress");
		$("input[type=submit]").attr("disabled", "disabled");
		
		var email = $("#email").val();
		var password = $("#password").val();
		
		var successful = false;
		var valid = validateLogin(email,password);
		if(valid) {
			var action = $(this).attr("action");
			$.post(
				action,
				{
					'email': email,
					'password': password
				},
				function(data) {
					var formalert;
					if(data=="success") {
						window.location.reload();
					}
					else if(data=="nomatch") {
						formalert = "Email and/or password is incorrect.";
						$("input[type=submit]").removeAttr("disabled");
					}
					else if(data=="unpaid") {
						formalert = "Account not activated yet. Please pay $5.00 membership fee at the next meeting.";
						$("input[type=submit]").removeAttr("disabled");
					}
					else if(data=="failure") {
						formalert = "Please fill in both email and password correctly.";
						$("input[type=submit]").removeAttr("disabled");
					}
						
					Materialize.toast(formalert);
				}
			);
		}
		else {
			Materialize.toast("Please fill in both email and password correctly.");
			$("input[type=submit]").removeAttr("disabled");
		}
		
		$("body").css("cursor", "auto");
		return false;
	});

	$("form#postnews-form").submit(function(e) {
		e.preventDefault();
		$("body").css("cursor", "progress");
		$("input[type=submit]").attr("disabled", "disabled");
		
		var title = $("#title").val();
		var content = $("#content").val();
		
		if(title != "" && content != "") {
			var action = $(this).attr("action");
			$.post(
				action,
				{
					'title': title,
					'content': content
				},
				function(data) {
					if(data=="success") {
						location.href="members.php?success=1";
					}
					else if(data=="failure") {
						location.href="members.php?failure=1";
					}
				}
			);
		}
		else {
			alert("Nothing posted");
			$("input[type=submit]").removeAttr("disabled");
		}
		
		$("body").css("cursor", "auto");
		return false;
	});

	function delete_user(index) {
		$("input#delete").attr("disabled", "disabled");
		$.post(
			"delete_user.php",
			{
				'index': index
			},
			function(data) {
				if(data=="success") {
					location.href="members.php?success=2";
				}
				else if(data=="failure") {
					location.href="members.php?failure=2";
				}
			}
		);
	}

	$("form#edituser-form").submit(function(e) {
		e.preventDefault();
		$("body").css("cursor", "progress");
		$("input[type=submit]").attr("disabled", "disabled");
		
		var fname = $("#fname").val();
		var lname = $("#lname").val();
		var password = $("#password").val();
		var grade = $("#grade").val();
		var email = $("#email").val();
		var dob = $("#dob").val();
		var phone = $("#phone").val();
		var status = $("#status").val();
		
		if(fname != "" && lname != "" && password != "" && email != "" && dob != "" && phone != "") {
			var action = $(this).attr("action");
			$.post(
				action,
				{
					'fname': fname,
					'lname': lname,
					'password': password,
					'grade': grade,
					'email': email,
					'dob': dob,
					'phone': phone,
					'status': status,
				},
				function(data) {
					if(data=="success") {
						location.href="members.php?success=2";
					}
					else if(data=="failure") {
						location.href="members.php?failure=2";
					}
				}
			);
		}
		else {
			alert("Cannot have empty values");
			$("input[type=submit]").removeAttr("disabled");
		}
		
		$("body").css("cursor", "auto");
		return false;
	});

	$("form#passchange-form").submit(function(e) {
		e.preventDefault();
		$("body").css("cursor", "progress");
		$("input[type=submit]").attr("disabled", "disabled");
		
		var oldpass = $("#oldpass").val();
		var newpass = $("#newpass").val();
		var confirmnewpass = $("#confirmnewpass").val();
		
		if(oldpass != "" && newpass != "" && confirmnewpass != "") {
			if(newpass == confirmnewpass) {
				var action = $(this).attr("action");
				$.post(
					action,
					{
						'oldpass': oldpass,
						'newpass': newpass,
						'confirmnewpass': confirmnewpass
					},
					function(data) {
						if(data=="success") {
							location.href="members.php?success=3";
						}
						else if(data=="badpass") {
							$("#form-alert").html("<span class='red'>Old password is incorrect.</span>");
						}
						else if(data=="failure") {
							$("#form-alert").html("<span class='red'>Please fill in all form fields correctly.</span>");
						}
					}
				);
			}
			else
				$("#form-alert").html("<span class='red'>New password fields do not match.</span>");
		}
		else {
			$("#form-alert").html("<span class='red'>Please fill in all form fields.</span>");
		}
		
		$("input[type=submit]").removeAttr("disabled");
		$("body").css("cursor", "auto");
		return false;
	});

	$("input#cancel").click(function() {
		history.go(-1);
	});

	$("form#fileupload-form").submit(function(e) {
		e.preventDefault();
		$("body").css("cursor", "progress");
		$("input[type=submit]").attr("disabled", "disabled");
		
		var file = document.getElementById("resource").files;
		
		if(file.length > 0) {
			var formData = new FormData($('form')[0]);
			$.ajax({
				url: 'upload.php',
				type: 'POST',
				success: function(data) {
					if(data=="success") {
						location.href="members.php?success=4";
					}
					else if(data=="failure") {
						$("#form-alert").html("<span class='red'>File upload error.</span>");
						$("input[type=submit]").removeAttr("disabled");
					}
				},
				data: formData,
				cache: false,
				contentType: false,
				processData: false
			});
		}
		else {
			$("#form-alert").html("<span class='red'>No file specified.</span>");
			$("input[type=submit]").removeAttr("disabled");
		}
		
		$("body").css("cursor", "auto");
		return false;
	});

	$('.modal-trigger').leanModal();
	$('#new-event-form').submit(function(evt) {
		evt.preventDefault();
		var eventName = $('#event-name').val();
		var eventType = $('#event-type').val();
		if(eventName == '') {
			return Materialize.toast('Please enter an event name', 2000);
		}
		$.post('/admin/manage_points/new_event', {
			name: eventName,
			type: eventType
		}, function(data) {
			if(data == 'OK') {
				window.location.reload();
				$('#new-event-form').closeModal();
			} else {
				Materialize.toast('Error creating event.', 2000);
			}
		});
	});

	$('.delete-event-button').click(function(evt) {
		var eventId = evt.target.getAttribute('data-eventId');
		$.post('/admin/event/'+eventId+'/delete', {}, function(data) {
			if(data == 'OK') {
				$('#delete-event-modal-'+eventId).closeModal();
				window.location.reload();
			} else {
				Materialize.toast('Could not delete event.');
			}
		});
	});

	$('#edit-event-form').submit(function(evt) {
		evt.preventDefault();
		var eventName = $('#event-name').val();
		var eventType = $('#event-type').val();
		if(eventName == '') {
			return Materialize.toast('Please enter an event name.');
		}
		var attendees = [];
		$('.did-attend-checkbox').each(function() {
			if(this.checked) {
				attendees.push($(this).attr('data-memberId'));
			}
		});
		var action = $(this).attr('action');
		$.post(action, {
			name: eventName,
			type: eventType,
			attendees: attendees
		}, function(data) {
			if(data == 'OK') {
				window.location.replace('/admin/manage_points');
			} else {
				Materialize.toast('Could not update event data.');
			}
		});
	});
	
  $(".button-collapse").sideNav();
});