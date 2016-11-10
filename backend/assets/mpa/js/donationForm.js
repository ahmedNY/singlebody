 var app = new Vue({
 	components: {
 	  radio: VueStrap.radio,
 	  alert: VueStrap.alert,
 	},
    el: '#donationForm',
    data: {
      formState: 1,
      selectedAmount: -1,
      otherAmount: 500,
      paymentType: "collector",
      phoneNumber: "",
      showErrorMessage: false,
      errorMessage: ""
    },
    methods: {
	   	nextState: function () {
	    	switch(this.formState) {
	    		case 1 :
	        		if(this.selectedAmount < 0 ) {
	        			this.showAlert("اختر المبلغ اولاً")
	        			return;
	        		}
	        		break;
	        	
	        	case 2 :
	        		if(this.paymentType == null || this.paymentType == "" ) {
	        			this.showAlert("اختر طريقة الدفع اولاً")
	        			return;
	        		}
	        		break;

    			case 3 :
    	    		if(this.phoneNumber.length < 10 ) {
    	    			this.showAlert("الرجاء ادخال رقم الهاتف")
    	    			return;
    	    		}
    	    		break;

	        	default :
	        		break;
	    	}

			if(this.formState < 5) {
				this.formState++ ;
			}
	    },
	    prevState: function() {
	    	if(this.formState > 1) {
	    		this.formState-- ;
	    	}
	    },
	    showAlert: function(msg) {
	    	this.errorMessage = msg;
	    	this.showErrorMessage = true;
	    },
	    finish: function() {
	    	console.log("hello")
	    }
	},
	watch: {
        'selectedAmount': function(val, oldVal){
	        if (val > 0) {
	            this.nextState();
	        }
      	},
        'paymentType': function(val, oldVal){
	        if (val !== null || val !== "") {
	            this.nextState();
	        }
      	}
    }
  })