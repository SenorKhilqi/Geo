function printExif(dataURL) {
  $("#imageDec").hide();

  var originalImg = new Image();
  originalImg.src = dataURL;
  originalImg.className = "processedImage";

  var exif = piexif.load(dataURL);
  var gpsIfd = exif["GPS"];

  if (!jQuery.isEmptyObject(gpsIfd)) {
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
    $("#coordinatesDMSRationalDec").html(
      "Coordinates in DMS as rational numbers: " + coordsDMSRational
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
    $("#coordinatesDMSDec").html("Coordinates in DMS: " + coordsDMS);    var exactLat, exactLng;
    
    // Try to get the exact values from custom EXIF tags
    if (gpsIfd[piexif.GPSIFD.GPSProcessingMethod] && gpsIfd[piexif.GPSIFD.GPSSatellites]) {
      exactLat = gpsIfd[piexif.GPSIFD.GPSProcessingMethod];
      exactLng = gpsIfd[piexif.GPSIFD.GPSSatellites];
    } else {
      // Fall back to calculated values if exact values aren't available
      exactLat = piexif.GPSHelper.dmsRationalToDeg(
        gpsIfd[piexif.GPSIFD.GPSLatitude],
        gpsIfd[piexif.GPSIFD.GPSLatitudeRef]
      ).toString();
      exactLng = piexif.GPSHelper.dmsRationalToDeg(
        gpsIfd[piexif.GPSIFD.GPSLongitude],
        gpsIfd[piexif.GPSIFD.GPSLongitudeRef]
      ).toString();
    }
    
    $("#coordinatesDecDegreesDec").html(
      "<strong>Koordinat (Desimal):</strong> " + exactLat + ", " + exactLng
    );

    var encodedMessage = `${gpsIfd[piexif.GPSIFD.GPSLatitude][2][0]}${
      gpsIfd[piexif.GPSIFD.GPSLatitude][2][1]
    }${gpsIfd[piexif.GPSIFD.GPSLongitude][2][0]}${
      gpsIfd[piexif.GPSIFD.GPSLongitude][2][1]
    }`;
    $("#encodedMessageDec").html(
      "Message encoded in decimals: " + encodedMessage
    );

    var clearMessage = messageDecoder(encodedMessage);
    $("#clearMessageDec").html("<b>Decoded message: " + clearMessage + "</b>");

    $("#coordinatesDMSRationalDec").show();
    $("#coordinatesDMSDec").show();
    $("#coordinatesDecDegreesDec").show();
    $("#encodedMessageDec").show();
    $("#clearMessageDec").show();
    $("#imageDec").show();
    $("#errorDec").hide();
  } else {
    $("#imageDec").show();
    $("#errorDec").show();
    $("#coordinatesDMSRationalDec").hide();
    $("#coordinatesDMSDec").hide();
    $("#coordinatesDecDegreesDec").hide();
    $("#encodedMessageDec").hide();
    $("#clearMessageDec").hide();
  }

  originalImg.onload = function () {
    $("#imageDec").html(originalImg);
  };
}

function messageDecoder(message) {
  var clearMessage = "";
  for (let i = 0; i < message.length; i += 2) {
    clearMessage =
      clearMessage +
      String.fromCharCode(`${message.charAt(i)}${message.charAt(i + 1)}`);
  }
  return clearMessage;
}

function handleFileSelectDec(evt) {
  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function (e) {
    printExif(e.target.result);
  };
  reader.readAsDataURL(file);
}
