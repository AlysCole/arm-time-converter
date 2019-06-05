var $ = require('jquery');
require('bootstrap');
require('moment');
require('../node_modules/moment-timezone/builds/moment-timezone-with-data-1970-2030.js');
require('tempusdominus-bootstrap-4');
require('./index.html');

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
import './css/styles.css';

(function() {
  const rLMinutesPerZTHour = 10;
  const zTHoursPerZTDay = 9;
  const zTDaysPerZTWeek = 11;
  const zTWeeksPerZTMonth = 21;
  const zTDaysPerZTMonth = 231;
  const zTMonthsPerZTYear = 3;
  const zTYearsPerZTAge = 77;
  const momentFormat = "YYYY-MM-DD HH:mm";
  let timeZone = "America/New_York";
  let realTimeInterval;

  const hoursInDay = [
    "before dawn",
    "dawn",
    "early morning",
    "late morning",
    "high sun",
    "early afternoon",
    "late afternoon",
    "dusk",
    "late at night"
  ];
  const daysInWeek = [
    "Ocandra",
    "Terrin",
    "Abid",
    "Cingel",
    "Nekrete",
    "Waleuk",
    "Yochem",
    "Huegel",
    "Dzeda",
    "Barani",
    "Detal"
  ];
  const monthsInYear = ["Descending Sun", "Low Sun", "Ascending Sun"];
  const yearEntitySymbols = [
    "Jihae's",
    "Drov's",
    "Desert's",
    "Ruk's",
    "Whira's",
    "Dragon's",
    "Vivadu's",
    "King's",
    "Silt's",
    "Suk-krath's",
    "Lirathu's"
  ];
  const yearMoodSymbols = [
    "Anger",
    "Peace",
    "Vengeance",
    "Slumber",
    "Defiance",
    "Reverence",
    "Agitation"
  ];

  const baseTime = new Date("6/14/2012 21:00:00 UTC");
  const baseZTHourOfDay = 1;
  const baseZTDay = 1;
  const baseZTMonth = 1;
  const baseZTYear = 1;
  const baseZTAge = 22;
  const baseTimeInHours =
    baseZTAge * (77 * 3 * 231 * 9) +
    (baseZTYear - 1) * (3 * 231 * 9) +
    (baseZTMonth - 1) * (231 * 9) +
    (baseZTDay - 1) * 9 +
    (baseZTHourOfDay - 1);
  const baseTimeInDays = baseTimeInHours / 9;
  const baseTimeInMonths = baseTimeInDays / 231;
  const baseTimeInYears = baseTimeInMonths / 3;
  const baseTimeInAges = baseTimeInYears / 77;

  Number.prototype.mod = function(n) {
    return (this % n + n) % n;
  };

  Number.prototype.nth = function() {
    const n = this % 10;
    const n2 = this % 100;
    const numString = String(this);

    if (n == 2 && n2 != 12) return numString + "nd";
    else if (n == 2 && n2 == 12) return numString + "th";
    if (n == 3 && n2 != 13) return numString + "rd";
    else if (n == 3 && n2 == 13) return numString + "th";
    if (n == 1 && n2 != 11) return numString + "st";
    else if (n == 1 && n2 == 11) return numString + "th";
    return numString + "th";
  };

  const getZTTime = function(time) {
    const timeOffset = time.getTime() - baseTime.getTime();
    const timeOffsetInMins = timeOffset / 1000 / 60;
    const timeOffsetInZTHours = timeOffsetInMins / 10;
    const timeOffsetInZTDays = timeOffsetInZTHours / 9;
    const timeOffsetInZTMonths = timeOffsetInZTDays / 231;
    const timeOffsetInZTYears = timeOffsetInZTMonths / 3;
    const timeOffsetInZTAges = timeOffsetInZTYears / 77;

    const timeInZTHours = timeOffsetInZTHours + baseTimeInHours;
    const timeInZTDays = timeOffsetInZTDays + baseTimeInDays;
    const timeInZTMonths = timeOffsetInZTMonths + baseTimeInMonths;
    const timeInZTYears = timeOffsetInZTYears + baseTimeInYears;
    const timeInZTAges = timeOffsetInZTAges + baseTimeInAges;

    const zTHour = Math.floor(timeInZTHours).mod(9) + 1;
    const zTDay = Math.floor(timeInZTDays).mod(231) + 1;
    const zTDayOfWeek = Math.floor(timeInZTDays).mod(11) + 1;
    const zTMonth = Math.floor(timeInZTMonths).mod(3) + 1;
    const zTYear = Math.floor(timeInZTYears).mod(77) + 1;
    const zTAge = Math.floor(timeInZTAges);

    return {
      hourNum: zTHour,
      hour: hoursInDay[zTHour - 1],
      day: daysInWeek[zTDayOfWeek - 1],
      dayOfMonth: zTDay,
      month: zTMonth,
      monthName: monthsInYear[zTMonth - 1],
      year: zTYear,
      yearName:
        yearEntitySymbols[(zTYear - 1).mod(11)] +
        " " +
        yearMoodSymbols[(zTYear - 1).mod(7)],
      age: zTAge.valueOf()
    };
  };

  const calculateRLTime = function(time) {
    // should be passed objects with the properties hour, day, month, year, and age.
    const timeInZTHours =
      time.age * 77 * 3 * 231 * 9 +
      (time.year - 1) * 3 * 231 * 9 +
      (time.month - 1) * 231 * 9 +
      (time.day - 1) * 9 +
      (time.hour - 1);

    const offsetInZTHours = timeInZTHours - baseTimeInHours;
    const offsetInRLMinutes = offsetInZTHours * 10;
    const offsetInRLSeconds = offsetInRLMinutes * 60;
    const offsetInRLMilliseconds = offsetInRLSeconds * 1000;

    console.log(`baseTimeInHours: ${baseTimeInHours}`);
    console.log(`Hours: ${offsetInZTHours}`);

    const unixTime = baseTime.getTime() + offsetInRLMilliseconds;
    const dateObj = new Date(unixTime);
    console.log(dateObj);
    console.log(moment(dateObj).tz("America/New_York").format());
    return dateObj;
  };

  const setTimeHTML = function(dateObj, ignoreSelector, keepIntervalRunning) {
    const currTime = getZTTime(dateObj);
    const serverTime = moment.tz(dateObj, "America/New_York");
    const localTime = moment(dateObj);
    let diff = moment(dateObj).diff(moment());

    if (!keepIntervalRunning) {
      clearInterval(realTimeInterval);
      realTimeInterval = false;
      $("#time-from-now").text(`(${localTime.fromNow()})`);
    } else {
      if (!realTimeInterval) startTimeInterval();
      diff = 0;
      $("#time-from-now").text('');
    }

    // determine the tense in the zalanthan time sentence
    if (diff < 0) {
      $("#zalanthan-tense").text("was");
    } else if (diff > 0) {
      $("#zalanthan-tense").text("will be");
    } else {
      $("#zalanthan-tense").text("is currently");
    }

    $("#local-time-time").text(localTime.format("h:mm:ss A"));
    $("#local-time-date").text(localTime.format("dddd, MMMM D, YYYY"));
    $("#edt-time").text(serverTime.format("h:mm A dddd, MMMM D, YYYY z"));
    $("#edt-time").attr("href", serverTime.format("?t=YYYY-MM-DD HH:mm"));
    $("#zalanthan-hour").text(currTime.hour);
    $("#zalanthan-day-name").text(currTime.day);
    $("#zalanthan-day").text(currTime.dayOfMonth.nth());
    $("#zalanthan-month").text(currTime.monthName);
    $("#zalanthan-year-name").text(currTime.yearName);
    $("#zalanthan-year").text(currTime.year);
    $("#zalanthan-age").text(currTime.age.nth());

    if (!ignoreSelector) {
      $("#hour-selector").val(currTime.hourNum);
      $("#day-selector").val(currTime.dayOfMonth);
      $("#month-selector").val(currTime.month);
      $("#year-selector").val(currTime.year);
      $("#age-selector").val(currTime.age);
    }
  };

  const startTimeInterval = function() {
    realTimeInterval = window.setInterval( () => {
      setTimeHTML(moment().toDate(), true, true);
    }, 100);
  };

  $(window).on("load", function() {
    const pickerEl = $("#datetimepicker1");
    const pickerInput = $("#datetimepicker-input");
    const todayBtn = $("#today-btn");
    const formats = [
      momentFormat,
      "YYYY-MM-DD hh:mm A",
      "YYYY-MM-DD hh:mm a"
    ];
    let current = moment();

    pickerEl.datetimepicker({
      widgetPositioning: {
        horizontal: 'auto',
        vertical: 'bottom'
      },
      format: momentFormat,
      timeZone: timeZone,
      allowInputToggle: true,
      keepOpen: true
    });

    $('#timezone-picker').on('change', function(data) {
      const value = data.target.value;
      if (value == "local") {
        timeZone = ''; 
      } else {
        timeZone = "America/New_York";
      }

      pickerEl.datetimepicker('timeZone', timeZone);
      console.log(pickerEl.datetimepicker('timeZone'));
    });

    let keepIntervalRunning = true;

    if (document.URL.indexOf("#") > -1) {
      let hashVal = decodeURI(
        document.URL.slice(document.URL.indexOf("#") + 1)
      );
      current = moment.tz(hashVal, "America/New_York");
      keepIntervalRunning = false;
    }

    if (window.location.search) {
      let queries = location.search.substr(1).split("&");

      queries = queries.map(function(query) {
        return query.split("=");
      });

      let matchQuery = queries.find(function(query) {
        if (query.indexOf("t") != -1) return true;
        return false;
      });

      current = moment.tz(decodeURI(matchQuery[1]), "America/New_York");
      keepIntervalRunning = false;
    }

    pickerInput.val(current.tz("America/New_York").format(momentFormat));
    setTimeHTML(current.toDate(), false, keepIntervalRunning);

    todayBtn.click(function() {
      let val = moment();
      if (timeZone)
        pickerInput.val(val.tz(timeZone).format(momentFormat));
      else
        pickerInput.val(val.format(momentFormat));

      setTimeHTML(val.toDate(), false, true);
      console.log("Date changed:", val);
      
      // clear hash value
      history.pushState(
        "",
        document.title,
        window.location.pathname
      );
    });

    $('#datetimepicker1').on('change.datetimepicker', onChangeDate);
    /*
    pickerInput.on('input', onChangeDate);
    */

    function onChangeDate(data) {
      let val = pickerInput.val();
      console.log("Time changed:" + val);
      if (!moment(val, momentFormat, true).isValid()) return false;

      let date = data.date || $('#datetimepicker1').datetimepicker('date');

      history.pushState(history.state, "", "?t=" + date.tz("America/New_York").format(momentFormat));
      setTimeHTML(date.toDate(), false, false);
    }

    $("#zalanthan-time-form").change(function(e) {
      let hour = parseInt($("#hour-selector").val()),
        day = parseInt($("#day-selector").val()),
        month = parseInt($("#month-selector").val()),
        year = parseInt($("#year-selector").val()),
        age = parseInt($("#age-selector").val());

      if (
        isNaN(hour) ||
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        isNaN(age)
      )
        return false;

      let zalanthanTime = {
          hour: hour,
          day: day,
          month: month,
          year: year,
          age: age
        },
        dateObj = calculateRLTime(zalanthanTime);

      history.pushState(history.state,
                        "",
                        "?t=" + encodeURI(
                          moment(dateObj).tz("America/New_York").format(momentFormat)
                        ));

      setTimeHTML(dateObj, true, false);
    });
  });
})();
