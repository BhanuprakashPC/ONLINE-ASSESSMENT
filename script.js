const questions=[
["Aptitude","If a train travels 120 km in 2 hours, average speed?",["40 km/h","50 km/h","60 km/h","80 km/h"],2],
["Aptitude","25% of 240 is:",["40","50","60","80"],2],
["Aptitude","Next: 2, 4, 8, 16, ?",["20","24","32","36"],2],
["Aptitude","A:B=2:3 and B:C=4:5. A:C is:",["8:15","2:5","4:15","8:5"],0],
["Aptitude","5 workers take 12 days. 10 workers take:",["3","6","12","24"],1],
["Data Structures","Which follows LIFO?",["Queue","Stack","Tree","Graph"],1],
["Data Structures","Which follows FIFO?",["Stack","Queue","Heap","Tree"],1],
["Data Structures","Binary search requires data to be:",["Random","Sorted","Duplicated","Unsorted"],1],
["Data Structures","Vertices connected by edges form a:",["Array","Stack","Graph","Queue"],2],
["Data Structures","Worst-case sequential search:",["O(1)","O(log n)","O(n)","O(n²)"],2],
["Operating Systems","Core of an operating system:",["Compiler","Kernel","Browser","Editor"],1],
["Operating Systems","Fixed time slice scheduling:",["FCFS","Round Robin","DFS","SJF"],1],
["Operating Systems","Virtual memory uses storage to extend:",["Cache","Hard disk/SSD","Register","ROM"],1],
["Operating Systems","Waiting indefinitely for resources can cause:",["Deadlock","Compilation","Sorting","Parsing"],0],
["Operating Systems","Which is system software?",["Operating System","Word document","Photo","Web page"],0],
["C Programming","Symbol that ends a C statement:",[".",";",":",","],1],
["C Programming","C program entry point:",["start()","main()","run()","init()"],1],
["C Programming","Pointer dereference operator:",["&","*","%","#"],1],
["C Programming","Single-character data type:",["char","string","character","text"],0],
["C Programming","Loop guaranteed to execute once:",["for","while","do-while","if"],2],
["Java","Keyword to create an object:",["class","new","object","create"],1],
["Java","Same method name with different parameters:",["Inheritance","Encapsulation","Method overloading","Abstraction"],2],
["Java","Java application entry point:",["start()","public static void main(String[] args)","run()","execute()"],1],
["Java","Keyword for class inheritance:",["implements","extends","inherits","super"],1],
["Java","Hiding implementation details is:",["Abstraction","Compilation","Iteration","Casting"],0],
["Simple Programming","Output: int x=5; System.out.println(x*2);",["5","7","10","25"],2],
["Simple Programming","Adjacent-element sorting algorithm:",["Binary Search","Bubble Sort","Merge Sort","DFS"],1],
["Simple Programming","If a=10 and a>5, output is:",["No","Yes","10","Error"],1],
["Simple Programming","Condition for even n:",["n/2==0","n%2==0","n*2==0","n-2==0"],1],
["Simple Programming","Main purpose of a loop:",["Repeat a block of code","Create class","Stop program","Declare package"],0]
];

let current=0,score=0,selected=-1,seconds=1800,student=null,timer=null,finished=false;
const $=id=>document.getElementById(id);
const attemptKey="bcaQuizAttempts",resultKey="bcaQuizResults";
const normalize=v=>v.trim().toUpperCase().replace(/\s+/g,"");

$("form").addEventListener("submit",function(e){
 e.preventDefault();
 const name=$("name").value.trim(),reg=$("reg").value.trim(),semester=$("sem").value,section=$("sec").value;
 if(!name||!reg||!semester||!section){$("error").textContent="Please fill in all student details.";return;}
 const attempts=JSON.parse(localStorage.getItem(attemptKey)||"[]");
 if(attempts.includes(normalize(reg))){$("error").textContent="This register number has already attended the quiz.";return;}
 student={name,registerNo:reg,semester,section};
 $("error").textContent="";$("start").classList.add("hidden");$("quiz").classList.remove("hidden");
 renderQuestion();timer=setInterval(updateTimer,1000);
});

function renderQuestion(){
 const q=questions[current];selected=-1;
 $("cat").textContent=q[0];$("qno").textContent="Question "+(current+1)+" of "+questions.length;
 $("question").textContent=q[1];$("bar").style.width=(current/questions.length*100)+"%";
 $("options").innerHTML="";$("next").disabled=true;
 $("next").textContent=current===questions.length-1?"Finish Quiz ✓":"Next Question →";
 q[2].forEach((option,index)=>{
  const button=document.createElement("button");button.type="button";button.className="option";
  button.textContent=String.fromCharCode(65+index)+". "+option;
  button.addEventListener("click",function(){
   selected=index;document.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));
   button.classList.add("selected");$("next").disabled=false;
  });
  $("options").appendChild(button);
 });
}

$("next").addEventListener("click",function(){
 if(selected<0)return;
 if(selected===questions[current][3])score++;
 current++;
 if(current<questions.length)renderQuestion();else finishQuiz();
});

function updateTimer(){
 seconds--;const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");
 $("time").textContent=m+":"+s;if(seconds<=0)finishQuiz();
}

function finishQuiz(){
 if(finished)return;finished=true;if(timer)clearInterval(timer);
 const attempts=JSON.parse(localStorage.getItem(attemptKey)||"[]"),regKey=normalize(student.registerNo);
 if(!attempts.includes(regKey)){attempts.push(regKey);localStorage.setItem(attemptKey,JSON.stringify(attempts));}
 const percentage=Math.round(score/questions.length*10000)/100,now=new Date();
 const result={name:student.name,registerNo:student.registerNo,semester:student.semester,section:student.section,score,total:questions.length,percentage,date:now.toLocaleDateString("en-IN"),time:now.toLocaleTimeString("en-IN")};
 const results=JSON.parse(localStorage.getItem(resultKey)||"[]");results.push(result);localStorage.setItem(resultKey,JSON.stringify(results));
 $("quiz").classList.add("hidden");$("result").classList.remove("hidden");$("msg").textContent="Well done, "+student.name+"!";
 $("final").textContent=score+" / "+questions.length+" ("+percentage+"%)";
}
