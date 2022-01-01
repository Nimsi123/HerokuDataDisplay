const submit_form = async () => {
  let formData = new FormData(document.getElementById("suggestions_box_form"));

  if ((formData.get("email") === "" || formData.get("product_name") === "") && formData.get("comments") === "") {
    return;
  }

  let postData = JSON.stringify({
    "data": {
      "email": formData.get("email"),
      "product_name": formData.get("product_name"),
      "comments": formData.get("comments")
    }
  })

  // replace button with loader
  document.getElementById("form-submit-wrapper").innerHTML = `
    <button class="btn btn-primary" type="button" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="sr-only">Loading...</span>
    </button>
  `;

  await fetch('https://api.apispreadsheets.com/data/MO2edWiG8Xj5yoeh/', {
      method:'POST',
      body: postData
  });

  document.getElementById("modal-close").click();

  // replace loader with button
  document.getElementById("form-submit-wrapper").innerHTML = `
    <button type="button" class="btn btn-primary" onclick="submit_form()">Submit</button>
  `;
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

//would get none because it hasn't loaded yet. use window.onload to wait until the page loads
window.onload = () => {
    setProgressData();
    current_level = 1;
    addButtons("insertbtns", current_level);
  }

