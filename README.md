#  How it works

This is a hacky prototype to simulate a timed conversation-facilitator. There are two html pages connected via sockets that can be accessed concurrently. 

On the student's end, they will see a gallery of pictures.

<img alt="main page" src="https://github.com/angelw22/Sprouts-P-C-Convo/blob/main/public/images/samples/mainpage.png?raw=true=250x" width="150px"/>

Once they click on a picture and press select, it will trigger the ready page.

<img alt="student ready page" src="https://github.com/angelw22/Sprouts-P-C-Convo/blob/main/public/images/samples/sreadypage.png?raw=true" width="150px"/>

The ready page will also appear on the parent's end.

<img alt="parent ready page" src="https://github.com/angelw22/Sprouts-P-C-Convo/blob/main/public/images/samples/preadypage.png?raw=true" width="150px"/>

Once they both click ready, the 3 min timer will start. After it counts down or if either parent or student clicks "finished", both parent and student can type a description of the photo. Typing on one end disables the field for the other.

<img alt="timer page" src="https://github.com/angelw22/Sprouts-P-C-Convo/blob/main/public/images/samples/timerpage.png?raw=true" width="150px"/>
<img alt="completed page" src="https://github.com/angelw22/Sprouts-P-C-Convo/blob/main/public/images/samples/completedpage.png?raw=true" width="150px"/>

On submit, the image should disappear from both galleries and the plant should "grow" (currently maxed at 5 growths). 

<img alt="main page with plant" src="https://github.com/angelw22/Sprouts-P-C-Convo/blob/main/public/images/samples/plantgrown.png?raw=true" width="150px"/>

### Note: 
App only takes the latest two socket connections into consideration and assigns them as adult and student respectively. If either the /adult or /student pages are accessed after existing connections are assigned, it will replace the current/previous connection.  
App needs to be rebooted to reset the images. 


#  Set up 

## Pages set up

Sample pages are at `/adult.html` and `/student.html`. 

Duplicate the pages and rename as *[adult's name]*.html and *[student's name]*.html respectively

In *[adult's name]*.html:
* Rename all text instances of Bryan to appropriate student name.

In *[student's name]*.html:
* Rename all text instances of "parent" to "teacher" if necessary. Else, no change required. 

For both:
* Replace all sample pictures to the ones collected for the test. Follow the incremental naming convention for ids and srcs, with relevant school value (e.g. responsibility, respect, etc.).

## Network considerations
If participants are on the same wifi, deploy app to localhost and access using [local ip address]/[specified student's name].

Else, host on web server (or expose your local server if you're comfortable). 

## Running the app

`$ node index.js`
To start the app. 