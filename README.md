![logo](http://i.imgur.com/H94aR3F.png?1) **awan** - a *'Cloud'*-based patient database
=====
Gone are the days when pen and paper are mightier than the sword.

Try the app out here

[awan database](https://awan-database.herokuapp.com/patient)

---

Getting Started
------
1. Fork this repo and clone
2. Set up environment values in .env.sample (instructions given in file)
3. npm install packages in terminal
4. Set up mongodb connection, and create `users` collection
5. Create user with `type: admin`
```Javascript
{
      username: <any String>
      password: <any 8 letters String>
      email: <email String>
      type: 'admin'
}
```
6. npm start, go to browser and access http://localhost:7777 and *wallah!*

---

## User Story
![Sample Problem](http://i.imgur.com/pAWwNvr.jpg?2 "sample problem")

The intended target market for this app is essentially clinics that are still using paper and filing system to store the records of patients information.

The idea is to provide an **easy-to-use** web app that is hassle-free and adaptable to the needs of the clinic. *(internet connection not required!)*

The end goal here is to increase the efficiency and reduce the amount of work dealing with the increasing patient records and database. *(saves physical space too!)*

---

Development Stage
------

#### Keypoints for Development
* Easy to use
* Light weight
* Efficient (saves time)

#### Entity Relation Diagram (ERD)
![ERD](http://i.imgur.com/qpB993R.png?1 "ERD")

The ERD has not changed from the beginning when I envisioned it.
However when I was building my models, I decided to only referenced the User in each of the Patient, Consultation & Medication model, but not the other way round. (Patient, Consultation & Medication are still referenced to each other as per the ERD)

The decision is made in consideration of how I am retrieving the data to index display, how my router & controller will be set up, and the fact that for this project itself, only one server will be used.

> Sample Code

```Javascript
function showAll (req, res, next) {
  console.log(req.user.id)
  var thead = cusFn.filterKeys(Object.keys(consultObj), ['user'])

  ConsultModel.find({
    user: req.user.id
  })
    .populate({
      path: 'patient'
    })
    .populate({
      path: 'prescription.medicine'
    })
    .sort({
      'date': 'asc'
    }).exec((err, data) => {
      if (err) console.error(err)
      res.render('consultViews/consultIndex', {
        thead: thead,
        allConsult: data,
        user: cusFn.userIsAvailable(req.user)
      })
    })
}
```

Ideally, in real life context, dedicated servers will be set up to each of the clinics to prevent mixing of data.

#### Crud Model
![CRUD](http://i.imgur.com/cPDrfGC.png?1 "CRUD")

Each of the documents will have access to full CRUD.


#### Process Flow
![Process Flow](http://i.imgur.com/p6ovFar.png?1 "Flow")

Designing the process flow is pretty intuitive (at first). I started with the User model, being the parent of the remaining three, then work my way to Consultation, then Medication; as how a User would use the application.

The basic flow of the User's process is as such
1. creates new Patient
2. creates new Consultation
3. includes Medication (pre-defined) as prescription(s)

> Note: As Consultation has a relationship of *one mandatory* to Patient, Patient has to be created first before creating Consultation

As all of the documents has access to full CRUD, User can easily update or remove the documents if required.

---

Challenges
------
During the development stage, I've realized that the way I define a model plays a big part in the structure of the application's codes and layout. For example if my model is defined as such

```JavaScript
var consultationObj = {
  'patient': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient'
  },
  'attending doctor': {
    type: String
  },
  'date': {
    type: String
  },
  'comments': {
    type: String
  },
  'prescription': [{
    medicine: {type: mongoose.Schema.Types.ObjectId,
      ref: 'medicine' },
    amount: String,
    unit: String
  }],
  'user': [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}
```

A simple ```forEach``` is no longer adequate to display the information to the Users.

A nested ```forEach``` will be required to display all the information under path: ```prescription```.

> Solution

```JavaScript
allConsult.forEach((consult, index) => { %>
  <tr id=<%- 'consultation/' + consult['id']%>>
      <td><a href="<%= 'patient/' + consult.patient.id %>"><%= consult.patient.fullName %></a></td>
      <td><%= consult['attending doctor'] %></td>
      <td><%= consult.date %></td>
      <td><%= consult.comments %></td>
      <td>
      <dl class="dl-horizontal">
        <% consult.prescription.forEach((med) => { %>
            <dt><%- med.medicine.name %></dt>
            <dd><%- med.amount + ' ' + med.unit %></dd>
        <% }) %>
        </dl>
      </td>
  </tr>
<% })
```
Displaying all consultations in consultation index

> Another example of how I've displayed Consultation

```JavaScript
<% patient.consultation.forEach((eachConsult, index1) => { %>
  <div class="panel panel-default">
    <div class="panel-heading"></div>
    <div class="panel-body">
      <dl class="dl-horizontal">
        <% consultPath.forEach((item, index) => {
          if (item !== 'prescription') { %>
            <dt><%- item %></dt>
            <dd><%- patient.consultation[index1][item] %></dd>
        <% } else if (item === 'prescription') { %>
            <dt><%- item %></dt>
        <%  patient.consultation[index1].prescription.forEach((med) => { %>
            <dd><%- med.medicine.name + ', ' + med.amount + ' ' + med.unit %></dd>
        <% })
        }
      }) %>
      </dl>
    </div>
  </div>
<% }) %>
```
Displaying all consultations of a patient, in patient info page

A lot of time is spent on making sure that the application is easily adaptable to the needs of the respective clinics.
> For example if a certain clinic requires additional entry fields to be added and structured a certain way, not a lot of changes has to be made to the application

---

Notables
------
#### Patient Search Bar
Part of my MVP is to have a more robust Patient search function that makes searching for Patient much much faster compared to the conventional method of searching through a shit tons of physical folders that a lot of clinics still uses.

I've implemented [JqueryUI's Autocomplete](https://jqueryui.com/autocomplete/)  to achieve this.

![Imgur](http://i.imgur.com/sBQz2Yc.gifv)
[search](http://i.imgur.com/sBQz2Yc.gifv)

I've taken into consideration that User may want to search for either the ```first name``` or ```last name``` of the patient.

To make this work, I've implemented the following
```JavaScript
function search (req, res, next) {
  var lookFor = {$regex: req.query.term, $options: 'i'}
  console.log(req.query.term)
  Patientmodel.find({
    user: req.user.id,
    $or: [
      {'first name': lookFor},
      {'last name': lookFor}
    ]})
    .select({'first name': 1, 'last name': 1, 'id': 1})
    .exec((err, data) => {
      if (err) console.error(err)
      console.log('data', data)
      var output = []
      data.forEach((item) => {
        var obj = {}
        obj.label = item['first name'] + ' ' + item['last name']
        obj.value = item['id']
        output.push(obj)
      })
      console.log('output', output)
      res.jsonp(output)
    })
}
```
Using *Regex*, the search result will be populated even though the entire ```first name``` or ```last name``` is not inputed.

Using ```$or``` enables the search between the property ```first name``` or ```last name```.

Using the ```select``` option provided by Autocomplete, I was able to define a callback function, that redirects the User to the respective Patient pages when clicked.

> Solution

```JavaScript
$('#autocomplete').autocomplete({
  source: '/patient/search',
  minLength: 3,
  select: function (event, ui) {
    window.location.href = '/patient/' + ui.item.value
  }
})
```
minLength defines the minimum number of character before a ```GET``` request is sent to ```/search```.

---


Future Improvement
------

1. Aside bar with links to certain section of page in ```creating new``` pages
2. Better security
3. Image upload function to upload clinic logos
4. A even more robust search function that searches everything

# Built With
* [JqueryUI](https://jqueryui.com/autocomplete/) - Autocomplete
* [Node](https://jqueryui.com/autocomplete/) - Backend setup
* [Passport](https://jqueryui.com/autocomplete/) - Authentication
* [Bcrypt](https://jqueryui.com/autocomplete/) - Password hashing
* [Jquery](https://jqueryui.com/autocomplete/) - DOM manipulation
* [Mongodb](https://www.mongodb.com) - Database
* [Mongoose](mongoosejs.com) - Object modelling
* **Embedded JavaScript (EJS)**
* **Bootstrap** - Aesthetics
* **HTML** - Web Page Structure

# Deployed With
* [Heroku](https://heroku.com)
* [mLab](https://mlab.com)

# Authors
It is [I](https://github.com/dorkblue)

# Acknowledgements/Credits
* Prima, YiSheng
* [Lou](https://github.com/imouto2005) - candy provider/code tester/imouto
* [Jonathan](https://github.com/noll-fyra) - code debates
* [Ian](https://github.com/iancwe) - partner in crime
* [Darrell](https://github.com/darrelltzj) - code debates/code tester
* [Robin](https://github.com/cwxr) & [Maria](https://github.com/hexhex23) - pizza and tea
