/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    sails.models.case.findOrCreate({ id: '1' }, {
      "id": 1,
      "group": 1,
      "owner": 1,
      "title": "ترميم عنبر الأطفال",
      "summary": "ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ",
      "story": "ترميم كامل لعنبر الأطفال في مستشفي البلك  ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك",
      "city": "الخرطوم",
      "section": "أبو ادم",
      "moneyRequired": 30000,
      "daysRemaining": 5,
      "category": "مشاريع بناء",
      "groupName": "شارع الحوادث",
      "createdAt": "2016-10-06T23:08:54.943Z",
      "updatedAt": "2016-10-09T00:06:44.847Z",
      "imageUrl": "/cases/image/1",
      "imageFd": "74a66b6c-f466-4480-8523-a7b8803bbcf0.jpg"
    }),
    sails.models.case.findOrCreate({ id: '2' }, {
      "id": 2,
      "group": 1,
      "owner": 1,
      "title": "مريض قلب يحتاج قسطره",
      "summary": "الطفل عمر ابن الست اشهر يعاني من مشاكل في القلب يحتاج بصورة عاجلة لموجات صوتية وتخطيط للقلب بتكلفة ( 600 ) جنيه",
      "story": "الطفل عمر ابن الست اشهر يعاني من مشاكل في القلب يحتاج بصورة عاجلة لموجات صوتية وتخطيط للقلب بتكلفة ( 600 ) جنيه",
      "city": "عطبرة",
      "section": "السكة حديد",
      "moneyRequired": 600,
      "daysRemaining": 5,
      "category": "عمليات",
      "groupName": "شارع الحوادث عطبرة",
      "createdAt": "2016-10-06T23:08:54.952Z",
      "updatedAt": "2016-10-09T00:19:50.612Z",
      "imageUrl": "/cases/image/2",
      "imageFd": "6baae92a-f32c-46b6-8afb-5d41b85b20b2.png"
  	}),
    sails.models.case.findOrCreate({ id: '3' }, {
      "id": 3,
      "group": 1,
      "owner": 1,
      "title": "احتياجات ادوية",
      "summary": "Maltvaitamin (20 pounds)- Navaporate Tabs (360 pounds)",
      "story": "ترميم كامل لعنبر الأطفال في مستشفي البلك  ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك ترميم كامل لعنبر الأطفال في مستشفي البلك",
      "city": "امدرمان",
      "section": "الحارة الرابعة",
      "moneyRequired": 380,
      "daysRemaining": 15,
      "category": "ادوية",
      "groupName": "شارع الحوادث عطبرة",
      "createdAt": "2016-10-06T23:08:54.954Z",
      "updatedAt": "2016-10-09T00:20:50.659Z",
      "imageUrl": "/cases/image/3",
      "imageFd": "f9214027-1572-462b-98a9-d883b9a0431a.jpg"
  	}),
  ]);
};
