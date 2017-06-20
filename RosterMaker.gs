function rosterMaker() {
  //spreadsheet id of the rosters
  var SHEET_ID = FormApp.getActiveForm().getDestinationId();
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var form = FormApp.getActiveForm();
  
  //get only the sheets with 'Roster' in the title
  var sheets = ss.getSheets()
    .filter(function(sheet) {return sheet.getName().match(/Roster/gi);});
  
  //add multiple choice item
  var classSelect = form.addMultipleChoiceItem()
    .setTitle('Choose a class');
  
  //get the class choices for the multiple choice item
  var classChoices = getClasses(sheets);
  
  //assign the choices to the classSelect variable
  classSelect.setChoices(classChoices);
}

function getClasses(sheets) {
  var classChoices = [];
  for(var i = 0; i < sheets.length; i++) {
    var className = sheets[i].getName();
    
    var classSection = form.addPageBreakItem()
      .setTitle(className)
      .setGoToPage(FormApp.PageNavigationType.SUBMIT);
    
    var students = getStudents(sheets[i]);
    
    var studentSelect = form.addCheckboxItem()
      .setTitle(className + ' absent')
      .setHelpText('Select the students who are absent from this class');
    
    var studentChoices = [];
    for(var j = 0; j < students.length; j++) {
      studentChoices.push(studentSelect.createChoice(students[j]));
    }
    
    studentSelect.setChoices(studentChoices);
    
    classChoices.push(classSelect.createChoice(className, classSection));
  }
  
  return classChoices;
}

function getStudents(sheet) {
  var studentValues = sheet.getDataRange().getValues();
  
  var students = [];
  for(var i = 1; i < studentValues.length; i++) {
    students.push(studentValues[i].join(' '));
  }
  return students;
}