function checkCoord(id) {
  var coord = document.getElementById(id).value;

  const regexLat = new RegExp("lat");
  const regexLng = new RegExp("lng");

  if (document.getElementById("randomCoords").checked) {
    return true;
  } else {
    // Parse the coordinate value to ensure it's a valid number
    var numValue = parseFloat(coord);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      alert("Koordinat harus berupa angka");
      return false;
    }
    
    // Check range for latitude (-90 to 90)
    if (regexLat.test(id) && (numValue < -90 || numValue > 90)) {
      alert("Latitude harus berada di antara -90 dan 90 derajat");
      return false;
    }
    
    // Check range for longitude (-180 to 180)
    if (regexLng.test(id) && (numValue < -180 || numValue > 180)) {
      alert("Longitude harus berada di antara -180 dan 180 derajat");
      return false;
    }
    
    return true;
  }
}

// Counter untuk menyimpan nomor file yang akan di-download
var fileCounter = 1;

function checkJpg() {
  var file = document.getElementById("files");
  var fileName = file.value;
  var ext = fileName.substring(fileName.lastIndexOf(".") + 1);
  if (ext == "jpg" || ext == "jpeg") {
    return true;
  } else {
    alert("Upload jpeg files only");
    file.focus();
    return false;
  }
}

function messageToDec(clearMessage) {
  // konversi pesan kedalam desimal
  clearMessage = clearMessage.toUpperCase();
  var decMessage = "";
  for (let i = 0; i < clearMessage.length; i++) {
    decMessage = decMessage + clearMessage.charCodeAt(i);
  }

  return decMessage;
}

function hideCoordsPicker() {
  if (document.getElementById("randomCoords").checked) {
    $("#customCoordsContainer").slideUp();
  } else {
    $("#customCoordsContainer").slideDown();
  }
}

/**
 * Generates a random coordinate with specified precision
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @param {number} decimalPlaces - Number of decimal places to preserve
 * @returns {string} - The random coordinate as a string with specified precision
 */
function generateRandomCoordinate(min, max, decimalPlaces) {
  const randomValue = Math.random() * (max - min) + min;
  return randomValue.toFixed(decimalPlaces);
}

function handleFileSelectEnc() {
  var message = messageToDec(document.getElementById("message").value);

  var splitterIndex = Math.floor(message.length / 4);
  var firstpart = message.substr(0, splitterIndex);
  var secondpart = message.substr(splitterIndex, splitterIndex);
  var thirdpart = message.substr(2 * splitterIndex, splitterIndex);
  var fourthpart = message.substr(3 * splitterIndex);

  var lat, lng;
  
  if (document.getElementById("randomCoords").checked) {
    // Generate random coordinates with high precision (7 decimal places)
    lat = generateRandomCoordinate(-90, 90, 7);
    lng = generateRandomCoordinate(-180, 180, 7);
  } else {
    // Get exact coordinate values as entered by the user
    lat = document.getElementById("latCust").value;
    lng = document.getElementById("lngCust").value;
  }
  
  // Store the original values as strings to preserve exact precision
  var exactLat = lat.toString();
  var exactLng = lng.toString();
  
  // Parse to float for calculations
  var latFloat = parseFloat(lat);
  var lngFloat = parseFloat(lng);

  var gpsIfd = {};
  gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = latFloat < 0 ? "S" : "N";
  gpsIfd[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(latFloat);
  gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lngFloat < 0 ? "W" : "E";
  gpsIfd[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lngFloat);
  
  // Store exact values in custom EXIF tags (using existing but rarely used tags)
  gpsIfd[piexif.GPSIFD.GPSProcessingMethod] = exactLat;
  gpsIfd[piexif.GPSIFD.GPSSatellites] = exactLng;

  gpsIfd[piexif.GPSIFD.GPSLatitude][2][0] = parseInt(firstpart, 10);
  gpsIfd[piexif.GPSIFD.GPSLatitude][2][1] = parseInt(secondpart, 10);

  gpsIfd[piexif.GPSIFD.GPSLongitude][2][0] = parseInt(thirdpart, 10);
  gpsIfd[piexif.GPSIFD.GPSLongitude][2][1] = parseInt(fourthpart, 10);

  var f = document.getElementById("files").files[0];
  if (!f.type.match("image/jpeg.*")) {
    alert("Upload jpeg files only");
    file.focus();
    return false;
  }

  $("#clearMessage").html(
    "Message: " + document.getElementById("message").value.toUpperCase()
  );
  $("#encodedMessage").html("Message encoded in decimals: " + message);

  var coordsDecDegrees =
    piexif.GPSHelper.dmsRationalToDeg(
      gpsIfd[piexif.GPSIFD.GPSLatitude],
      gpsIfd[piexif.GPSIFD.GPSLatitudeRef]
    ) +
    ", " +
    piexif.GPSHelper.dmsRationalToDeg(
      gpsIfd[piexif.GPSIFD.GPSLongitude],
      gpsIfd[piexif.GPSIFD.GPSLongitudeRef]
    );
  // Display the exact coordinate values that were entered/generated
  $("#coordinatesDecDegrees").html(
    "<strong>Koordinat (Desimal):</strong> " + exactLat + ", " + exactLng
  );

  var coordsDMS =
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLatitude][0][0] /
      gpsIfd[piexif.GPSIFD.GPSLatitude][0][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLatitude][1][0] /
      gpsIfd[piexif.GPSIFD.GPSLatitude][1][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLatitude][2][0] /
      gpsIfd[piexif.GPSIFD.GPSLatitude][2][1] +
    ", " +
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLongitude][0][0] /
      gpsIfd[piexif.GPSIFD.GPSLongitude][0][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLongitude][1][0] /
      gpsIfd[piexif.GPSIFD.GPSLongitude][1][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLongitude][2][0] /
      gpsIfd[piexif.GPSIFD.GPSLongitude][2][1];
  $("#coordinatesDMS").html("Coordinates in DMS: " + coordsDMS);

  var coordsDMSRational =
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLatitude][0][0] +
    "/" +
    gpsIfd[piexif.GPSIFD.GPSLatitude][0][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLatitude][1][0] +
    "/" +
    gpsIfd[piexif.GPSIFD.GPSLatitude][1][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLatitude][2][0] +
    "/" +
    gpsIfd[piexif.GPSIFD.GPSLatitude][2][1] +
    ", " +
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLongitude][0][0] +
    "/" +
    gpsIfd[piexif.GPSIFD.GPSLongitude][0][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLongitude][1][0] +
    "/" +
    gpsIfd[piexif.GPSIFD.GPSLongitude][1][1] +
    "; " +
    gpsIfd[piexif.GPSIFD.GPSLongitude][2][0] +
    "/" +
    gpsIfd[piexif.GPSIFD.GPSLongitude][2][1];
  $("#coordinatesDMSRational").html(
    "Coordinates in DMS as rational numbers: " + coordsDMSRational
  );

  $("#image").hide();

  var reader = new FileReader();
  reader.onloadend = function (e) {
    var origin = piexif.load(e.target.result);

    var exifBytes = {};

    if (document.getElementById("eraseData").checked) {
      var exifObj = { GPS: gpsIfd };
      exifBytes = piexif.dump(exifObj);
    } else {
      origin["GPS"] = gpsIfd;
      exifBytes = piexif.dump(origin);
    }    // insert exif binary into JPEG binary(DataURL)
    var jpeg = piexif.insert(exifBytes, e.target.result);

    // show JPEG modified exif
    var image = new Image();
    image.src = jpeg;
    //image.width = 200;

    image.className = "processedImage";    $("#image").html(image);
    $("#image").show();
    $("#encDetailsContainer").show();
      // Mendapatkan nama file asli
    var originalFileName = f.name;
    var fileNameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf("."));
    
    // Mengatur nama file download dengan format nama asli(ke n)
    var fileName = fileNameWithoutExt + "(" + fileCounter + ").jpg";
    $("#downloadButton").prop("href", image.src);
    $("#downloadButton").attr("download", fileName);
    
    // Menampilkan informasi nama file asli
    $("#fileNameInfo").html("<strong>Nama File:</strong> " + fileName);
    $("#fileNameInfo").show();
    $("#imageSpan").show();
    $("#downloadButton").show();
    
    // Tingkatkan counter untuk download berikutnya
    fileCounter++;
  };
  reader.readAsDataURL(f);
}
