const submit_form = async () => {

  const place_loading_button = (id) => {
    document.getElementById(id).innerHTML = `
      <button class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">Loading...</span>
      </button>
    `;
  }
  
  const place_submit_button = (id) => {
    document.getElementById(id).innerHTML = `
    <button type="button" class="btn btn-primary" onclick="submit_form()">Submit</button>
  `;
  }

  const organize_suggestion_data = (formData) => {
    return JSON.stringify({
      "data": {
        "email": formData.get("email"),
        "product_name": formData.get("product_name"),
        "comments": formData.get("comments")
      }
    });
  }

  let formData = new FormData(document.getElementById("suggestions_box_form"));
  if ((formData.get("email") === "" || formData.get("product_name") === "") && formData.get("comments") === "") {
    return;
  }

  place_loading_button("form-submit-wrapper");

  await fetch('https://api.apispreadsheets.com/data/MO2edWiG8Xj5yoeh/', {
      method:'POST',
      body: organize_suggestion_data(formData)
  });

  document.getElementById("modal-close").click();

  place_submit_button("form-submit-wrapper");
}

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

window.onload = () => {
  // Note: document is initially none because the window hasn't properly loaded.
  // Note: this is why we need to set the onload function (callback based)
    setProgressData();
    current_level = 1;
    addButtons("insertbtns", current_level);
}

