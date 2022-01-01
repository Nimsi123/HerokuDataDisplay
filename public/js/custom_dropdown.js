/*
Note: Every button in the first level holds some state (about the level)
Note: This is what let's us to keep `current_level` from increasing out of control
*/

var current_level = -1;
const current_selection = [];

const non_final_level_onclick = (item, level) => { 
    /* Returns the .onclick attribute for elements that require further selection. */
    return () => {
        document.getElementById(level + "-btnholder").innerHTML = item; // add name to current dropdown
        current_selection[level - 1] = item; // zero-indexed 

        current_level = level + 1;
        hideDropdowns(current_level);
        showDropdown(current_level);
        addButtons((current_level) + "-insertbtns", current_level);
    }
}

const final_level_onclick = (item, level) => {
    return () => {
        document.getElementById(level + "-btnholder").innerHTML = item;
        current_selection[level - 1] = item; // zero-indexed 
        displayPhoto(item);
    }
};

const makeOneButton = (item, level) => {
    /*
    Create a single button in the dropdown.

    Some notes
    ----------
    Buttons maintain state about what level they're in.
    */

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

const walk_down_hierarchy = (level) => {
    /*
    Returns the item hierarchy at the given level given the user's
    curent selection.
    */
    let items = items_hierarchy;
    for (let temp = 1; temp < level; temp++) {
        items = items[current_selection[temp - 1]];
    }
    return items;
}

const at_max_level = () => {
    // finds the max_level based on the current selection behavior

    let items = walk_down_hierarchy(current_level);
    return Array.isArray(items);
}

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
    dropdown.innerHTML = ""; // empty dropdown list (reset)

    let items = walk_down_hierarchy(level);
    if (!Array.isArray(items)) {
        // is a dictionary
        items = Object.keys(items);
    }

    items.forEach(item => dropdown.appendChild(
        makeOneButton(item, level)
    ));
}

const hideDropdowns = (level) => {
    /*Adds hiding styles to the #-drop element, where # is count <= # < 4.*/
    const hideOneDropdown = (level) => {
        var element = document.getElementById(level + "-drop");

        if (element !== undefined && element !== null) {
            element.getElementsByTagName("button")[0].innerHTML = "Sub-category";
            element.style = "display:none;";
        }
    };

    for (var i = level; i < 4; i++) {
        hideOneDropdown(i);
    }
}
  
const showDropdown = (count) => {
    /* Removes any hiding styles from the count-th dropdown selector. */

    var element = document.getElementById(count + "-drop");
    if (element !== undefined && element !== null) {
        element.style = "";
    }
}

const displayPhoto = async (queryName) => {
    const url = "/download_photo/?file=" + queryName.replace(/ /g, "_") + ".png";

    fetch(url)
        .then(response => {
            response.blob()
                .then(blobResponse => {
                    var urlCreator = window.URL || window.webkitURL;
                    document.getElementById("photo").src = urlCreator.createObjectURL(blobResponse);
            })
        });
}