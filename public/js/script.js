//d -> JSON object from json.js

function setProgressData() {
  /*
  Uses `web_stats`, which is defined in `web_stats.js`
  Called when the page loads.

  11860 pages scraped!
  2372000 recorded sales!
  0.29 gigabytes of stored data!
  and counting ...
  */
  document.getElementById("num_scraped_pages").innerHTML = web_stats.num_scraped_pages + " pages scraped!";
  document.getElementById("num_recorded_sales").innerHTML = web_stats.num_recorded_sales + " recorded sales!";
  document.getElementById("gig_stored_data").innerHTML = web_stats.gig_stored_data + " gigabytes of stored data!";
}

//would get none because it hasn't loaded yet. use window.onload to wait until the page loads
window.onload = function(){
  setProgressData();
  addButtons("insertbtns", items_hierarchy, 1);
}

function makeOneButton(items_hierarchy, key, level) {
  // create a single button with .class, .type, .innerHTML, and .onclick attributes
  var btn = document.createElement("button");
  btn.className = "dropdown-item";
  btn.type = "button";
  btn.innerHTML = key;

  /*onclick function*/
  if(items_hierarchy[key][0] === undefined){
    // a dictionary (nested, more to come)
    btn.onclick = deepOnClick(items_hierarchy[key], key, level)
  } else{
    // a list (end of dropdowns)
    btn.onclick = shallowOnClick((level + 1) + "-insertbtns", items_hierarchy[key], level, key);
  }
  return btn;
}

function addButtons(ID, items_hierarchy, level){
  /* Adds buttons to a dropdown element for each key in the dictionary `d`

  :param ID: The .id of the dropdown element. Append the newly created buttons to this element.
  :type ID: string
  :param d: a dictionary. keys are the relative category, and the values are the relative sub-categories.
  :type d: object
  :param count: the dropdown element number where the buttons are placed.
  :type count: number
  :rtype: undefined
  */

  /*
  This function populates the `level`th dropdown with buttons, each one with a name 
  at the `level`th depth in the item_hierarchy dictionary.
  */

  var dropdown = document.getElementById(ID);
  dropdown.innerHTML = ""; //empty list

  for(var key in items_hierarchy){
    dropdown.appendChild(
      makeOneButton(items_hierarchy, key, level) 
      );
  }
}

function deepOnClick(items_hierarchy, title, count){ 
  /*Returns the .onclick attribute for elements that require further selection.*/
  return function() {
    document.getElementById(count + "-btnholder").innerHTML = title; // add name to current dropdown

    //remove & make
    hideDropdown(count + 1);
    showDropdown(count + 1);

    addButtons((count+1) + "-insertbtns", items_hierarchy, count + 1); //add buttons to the next dropdown
  }
}

function shallowOnClick(ID, keys, count, title){
  /*Returns the .onclick attribute for the 2nd-to-last-category dropdown button. Iterates over arrays, versus a dictionary. 
  :param ID:
  :type ID:
  :param keys:
  :type keys:
  :param count:
  :type count:
  :param title:
  :count title:
  :returns: A function used as the .onclick attribute for the dropdown button.
  :rtype: function

  Last time filling in dropdown.
  Iterates over a list*/

  return function(){

    document.getElementById(count + "-btnholder").innerHTML = title; // add name to current dropdown

    //hide and show
    hideDropdown(count + 1);
    showDropdown(count + 1);

    var dropdown = document.getElementById(ID);
    dropdown.innerHTML = ""; //empty list

    for(var i = 0; i < keys.length; i++){
      var btn = document.createElement("button");
      btn.className = "dropdown-item";
      btn.type = "button";
      btn.innerHTML = keys[i];

      /*onclick function*/
      btn.onclick = function(){
        document.getElementById((count + 1) + "-btnholder").innerHTML = this.innerHTML;
        console.log(this.innerHTML);
        accessPhotos(this.innerHTML);
      };

      dropdown.appendChild(btn);
    }
  }
}

function hideDropdown(count){
  /*Adds hiding styles to the #-drop element, where # is count <= # < 4.*/

  for(var i = count; i < 4; i++){
    var element = document.getElementById(i + "-drop");

    if (element !== undefined && element !== null) {
      element.getElementsByTagName("button")[0].innerHTML = "Sub-category";
      element.style = "display:none;";
    }
  }
}

function showDropdown(count){
  /*Removes any hiding styles from the #-drop element, where # is count.*/

  var element = document.getElementById(count + "-drop");
  if (element !== undefined && element !== null) {
    element.style = "";
  }
}

function accessPhotos(queryName){
  /*Sets the .src attribute of the image tag under 'View Graphs' to the directory of the image corresponding to 'queryName.'
  :type queryName: string
  */
  var directory = "PNG/" + queryName.replace(/ /g, "_") + "_combo.png";
  document.getElementById("photo").src = directory;
}