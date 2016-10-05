/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    sails.models.case.findOrCreate({ id: '1' }, {
      "id": 1,
  	  "title": "ترميم عنبر الأطفال",
  	  "summary": "ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ",
  	  "story": "ترميم كامل لعنبر الأطفال في مستشفي البلك  ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك",
  	  "city": "امدرمان",
  	  "section": "الحارة الرابعة",
  	  "moneyRaised": 29000,
  	  "moneyRequired": 30000,
  	  "daysRemaining": 5,
  	  "donorsCount": 68,
  	  "category": "مشروع بناء",
  	  "groupName": "شارع الحوادث",
  	  "image": "belk-hospital.jpg"
  	}),
    sails.models.case.findOrCreate({ id: '2' }, {
      "id": 2,
  	  "title": "مريض قلب يحتاج قسطره",
  	  "summary": "الطفل عمر ابن الست اشهر يعاني من مشاكل في القلب يحتاج بصورة عاجلة لموجات صوتية وتخطيط للقلب بتكلفة ( 600 ) جنيه",
  	  "story": "الطفل عمر ابن الست اشهر يعاني من مشاكل في القلب يحتاج بصورة عاجلة لموجات صوتية وتخطيط للقلب بتكلفة ( 600 ) جنيه",
  	  "city": "امدرمان",
  	  "section": "الحارة الرابعة",
  	  "moneyRaised": 200,
  	  "moneyRequired": 800,
  	  "daysRemaining": 5,
  	  "donorsCount": 18,
  	  "category": "عمليات",
  	  "groupName":"شارع الحوادث عطبرة",
  	  "image": "heart-op.png"
  	}),
    sails.models.case.findOrCreate({ id: '3' }, {
      "id": 3,
  	  "title": "احتياجات ادوية",
  	  "summary": "Maltvaitamin (20 pounds)- Navaporate Tabs (360 pounds)" ,
  	  "story": "ترميم كامل لعنبر الأطفال في مستشفي البلك  ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك",
  	  "city": "امدرمان",
  	  "section": "الحارة الرابعة",
  	  "moneyRaised": 400,
  	  "moneyRequired": 380,
  	  "daysRemaining": 15,
  	  "donorsCount": 1,
  	  "category": "ادوية",
  	  "groupName":"شارع الحوادث عطبرة",
  	  "image": "safia-kid.jpg"
  	}),
  ]);
};
