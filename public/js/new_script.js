/*
Note: Every button in the first level holds some state (about the level)
Note: This is what let's us to keep `current_level` from increasing out of control
*/

var current_level = -1;
const current_selection = [];

const setProgressData = () => {
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
window.onload = () => {
    setProgressData();
    current_level = 1;
    addButtons("insertbtns", current_level);
  }

const makeOneButton = (item, level) => {
    // create a single button in the dropdown

    var btn = document.createElement("button");
    btn.className = "dropdown-item";
    btn.type = "button";
    btn.innerHTML = item;

    if (at_max_level()) {
        btn.onclick = final_level_onclick(item, level);
    } else {
        btn.onclick = non_final_level_onclick(item, level);
    }

    return btn;
}

const at_max_level = () => {
    // finds the max_level based on the current selection behavior

    // walk down hierarchy
    var items = items_hierarchy;
    var level;
    for (level = 1; level < current_level; level++) {
        items = items[current_selection[level - 1]];
    }
    
    if (Array.isArray(items)) {
        return true;
    }

    return false;
}

const non_final_level_onclick = (item, level) => { 
    /*Returns the .onclick attribute for elements that require further selection.*/

    return () => {

        // current level
        document.getElementById(level + "-btnholder").innerHTML = item; // add name to current dropdown
        current_selection[level - 1] = item; // zero-indexed 

        // next level
        current_level = level + 1;

        // remove & make
        hideDropdown(current_level);
        showDropdown(current_level);

        addButtons((current_level) + "-insertbtns", current_level);
    }
  }

const final_level_onclick = (item, level) => {

    return () => {
        console.log(item);
        document.getElementById(level + "-btnholder").innerHTML = item;
        current_selection[level - 1] = item; // zero-indexed 
        accessPhotos(item);
    }

  };

const addButtons = (ID, level) => {
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
    dropdown.innerHTML = ""; // empty list

    // walk down hierarchy
    var items = items_hierarchy;
    for (var temp = 1; temp < level; temp++) {
        items = items[current_selection[temp - 1]];
    }
    
    if (!Array.isArray(items)) {
        // is a dictionary
        var temp = [];
        for (var item in items) {
            // iterate over keys
            temp.push(item);
        }
        items = temp;
    }

    items.forEach(item => dropdown.appendChild(
        makeOneButton(item, level)
    ));
}

const hideDropdown = (count) => {
    /*Adds hiding styles to the #-drop element, where # is count <= # < 4.*/

    for (var i = count; i < 4; i++) {
        var element = document.getElementById(i + "-drop");

        if (element !== undefined && element !== null) {
            element.getElementsByTagName("button")[0].innerHTML = "Sub-category";
            element.style = "display:none;";
        }
    }
}
  
const showDropdown = (count) => {
    /*Removes any hiding styles from the #-drop element, where # is count.*/

    var element = document.getElementById(count + "-drop");
    if (element !== undefined && element !== null) {
        element.style = "";
    }
}

const accessPhotos = async (queryName) => {
    const url = "/download_photo/?file=" + queryName.replace(/ /g, "_") + ".png";

    fetch(url).then(response => {
      response.blob()
        .then(blobResponse => {
            var urlCreator = window.URL || window.webkitURL;
            console.log(blobResponse);
            document.getElementById("photo").src = urlCreator.createObjectURL(blobResponse);
      })
    });
}