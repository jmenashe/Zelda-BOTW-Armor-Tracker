'use strict';

// Sources
// https://i.imgur.com/jBPnlPT.png
// https://rankedboost.com/zelda-breath-of-the-wild/armor-upgrades/
// Colour scheme help - https://coolors.co/737765-007ea8-9b5c43-007388-394141

var app = function () {
  var armor = armor_data;
  var checkboxes = [];
  var canvases = [];
  var resultDisplay = "";
  var images = {};

  function loadImages() {
    var loadTrack = loaded(fillCanvases, 4); //Preload images. then init.

    function loaded(fn, goal) {
      var count = 0;

      return function () {
        count++;
        if (count === goal) {
          fn();
        }
      };
    }

    images["Head"] = new Image();
    images["Head"].onload = loadTrack;
    images["Head"].src = "http://volv.org/zelda/images/headItems.png";
    images["Chest"] = new Image();
    images["Chest"].onload = loadTrack;
    images["Chest"].src = "http://volv.org/zelda/images/chestItems.png";
    images["Leg"] = new Image();
    images["Leg"].onload = loadTrack;
    images["Leg"].src = "http://volv.org/zelda/images/legItems.png";
    images["check"] = new Image();
    images["check"].onload = loadTrack;
    images["check"].src = "http://volv.org/zelda/images/check.png";
  }

  //TODO - translate to React...
  function createSet(_ref) {
    var name = _ref.name;
    var pieces = _ref.pieces;
    var upgrades = _ref.upgrades;
    var base_price = _ref.base_price || [];
    var checked = _ref.checked;
    var _ref$individual = _ref.individual;
    var individual = _ref$individual === undefined ? null : _ref$individual;

    var itemSet = document.createElement("div");
    var label = document.createElement("label");
    var labelSpan = document.createElement("span");
    var inclusionCheckboxDiv = document.createElement("div");
    var inclusionCheckbox = document.createElement("input");
    var toggleCheckbox = document.createElement("input");
    var tableDiv = document.createElement("div");
    var table = document.createElement("table");

    itemSet.setAttribute("class", "itemSet");
    label.setAttribute("class", "setHeader");
    label.setAttribute("for", name);
    labelSpan.setAttribute("class", "setFullName");
    labelSpan.innerHTML = name;

    inclusionCheckboxDiv.setAttribute("class", "setIncluded");
    inclusionCheckboxDiv.setAttribute("title", 'Include in Item Count\nRight Click/Long Press to Select/Deselect All');
    inclusionCheckboxDiv.appendChild(inclusionCheckbox);
    inclusionCheckbox.setAttribute("type", "checkbox");
    inclusionCheckbox.setAttribute("class", "inclusionCheckbox");
    inclusionCheckbox.checked = checked;

    toggleCheckbox.setAttribute("type", "checkbox");
    toggleCheckbox.setAttribute("class", "setToggle");
    toggleCheckbox.setAttribute("id", name);
    toggleCheckbox.checked = true;
    if (name === "Champion's Tunic") {
      toggleCheckbox.checked = false;
    }

    tableDiv.setAttribute("class", "setDetails");
    tableDiv.appendChild(table);
    table.innerHTML = '<tr><th>Base</th><th>Tier 1</th><th>Tier 2</th><th>Tier 3</th><th>Tier 4</th></tr><tr>';

    var tr = document.createElement("tr");

    // Base Material Cell

    var td = document.createElement("td");
    var p = document.createElement("p");
    p.setAttribute("class", "ingredients");
    p.setAttribute("title", "Per Item");
    p.innerHtml = '';
    for(var i = 0; i < base_price.length; i++) {
      p.innerHTML += base_price[i].name + ' x ' + base_price[i].qty + '<br>'; //Here to 'fix' awkward armor
    }
    td.appendChild(p);
    tr.appendChild(td);

    // Upgrade Material Cells

    for (var i = 0; i < 4; i++) {
      var td = document.createElement("td");
      var p = document.createElement("p");
      p.setAttribute("class", "ingredients");
      if (individual === null || !individual['t' + (i + 1) + 'Head'][1]) {
        p.setAttribute("title", "Per Item");
      } else {
        var ingredientString = "";
        ingredientString += 'Head - ' + individual['t' + (i + 1) + 'Head'][1].name + '\n';
        ingredientString += 'Chest - ' + individual['t' + (i + 1) + 'Chest'][1].name + '\n';
        ingredientString += 'Leg - ' + individual['t' + (i + 1) + 'Leg'][1].name;
        p.setAttribute("title", ingredientString);
      }
      p.innerHTML = upgrades[i][0].name + ' x ' + upgrades[i][0].qty + '<br>'; //Here to 'fix' awkward armor
      p.innerHTML += upgrades[i][1] ? upgrades[i][1].name + ' x ' + upgrades[i][1].qty + '<br>' : '';
      td.appendChild(p);
      tr.appendChild(td);
    }

    table.appendChild(tr);

    tr = document.createElement("tr");
    

    // Base Image Cells
    var td = document.createElement("td");
    for (var j = 0; j < pieces.length; j++) {
      var canvas = document.createElement("canvas");
      canvas.width = 48;
      canvas.height = 48;
      canvas.setAttribute("class", "item");
      canvas.setAttribute("alt", pieces[j].type);
      canvas.setAttribute("type", pieces[j].type);
      canvas.setAttribute("picX", pieces[j].x);
      canvas.setAttribute("picY", pieces[j].y);
      canvas["desc"] = name + ' - ' + pieces[j].type;
      canvas["set"] = '' + name;
      canvas["ticked"] = false;
      canvas.setAttribute("title", pieces[j].type);
      canvas.upgrades = base_price;

      td.appendChild(canvas);
    }

    tr.appendChild(td);

    // Upgrade Material Cells
    for (var i = 0; i < 4; i++) {
      var td = document.createElement("td");

      for (var j = 0; j < pieces.length; j++) {
        var canvas = document.createElement("canvas");
        canvas.width = 48;
        canvas.height = 48;
        canvas.setAttribute("class", "item");
        canvas.setAttribute("alt", pieces[j].type);
        canvas.setAttribute("type", pieces[j].type);
        canvas.setAttribute("picX", pieces[j].x);
        canvas.setAttribute("picY", pieces[j].y);
        canvas["desc"] = name + ' - ' + pieces[j].type;
        canvas["set"] = '' + name;
        canvas["ticked"] = false;

        //Allowances for awkward upgrades..
        if (individual === null || !individual['t' + (i + 1) + 'Head'][1]) {
          canvas.setAttribute("title", pieces[j].type);
          canvas.upgrades = upgrades[i];
        } else {
          var ingredientString = '' + individual['t' + (i + 1) + pieces[j].type][1].name;
          canvas.setAttribute("title", ingredientString);
          canvas.upgrades = individual['t' + (i + 1) + pieces[j].type];
        }

        td.appendChild(canvas);
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);

    label.appendChild(labelSpan);
    label.appendChild(inclusionCheckboxDiv);

    itemSet.appendChild(label);
    itemSet.appendChild(toggleCheckbox);
    itemSet.appendChild(tableDiv);

    return itemSet;
  }

  function doRandomImages() {
    function rndItem(ctx) {
      var scale = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var type = arguments[2];

      var x = 0,
          y = 0,
          upper = 0;

      if (type === "Head") {
        y = Math.floor(Math.random() * 16);
        upper = y === 15 ? 5 : 16;
        x = Math.floor(Math.random() * upper);
      }

      if (type === "Chest") {
        y = Math.floor(Math.random() * 18);
        upper = y === 16 ? 8 : upper = y === 17 ? 1 : 16;
        x = Math.floor(Math.random() * upper);
      }

      if (type === "Leg") {
        y = Math.floor(Math.random() * 19);
        upper = y === 17 ? 8 : 16;
        x = Math.floor(Math.random() * upper);
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawItem(type, x, y, ctx, scale);
    }

    var randomHead = $('#randomHead')[0];
    var randomChest = $('#randomChest')[0];
    var randomLeg = $('#randomLeg')[0];
    var randomHeadCTX = randomHead.getContext("2d");
    var randomChestCTX = randomChest.getContext("2d");
    var randomLegCTX = randomLeg.getContext("2d");
    randomHead.width = 96;randomHead.height = 96;
    randomChest.width = 96;randomChest.height = 96;
    randomLeg.width = 96;randomLeg.height = 96;
    setInterval(rndItem, 400, randomHeadCTX, 2, "Head");
    setInterval(rndItem, 500, randomChestCTX, 2, "Chest");
    setInterval(rndItem, 600, randomLegCTX, 2, "Leg");
  }

  function drawItem(type, x, y, ctx) {
    var scale = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];

    var xPos = 1 + 96 * x + x;
    var yPos = 1 + 96 * y + y;
    ctx.drawImage(images[type], xPos, yPos, 96, 96, 0, 0, 48 * scale, 48 * scale);
    if (ctx.canvas.ticked) {
      ctx.drawImage(images["check"], 20 * scale, 20 * scale, 22 * scale, 22 * scale);
    }
  }

  function drawFromItemList(canvas) {
    var ctx = canvas[0].getContext("2d");
    ctx.clearRect(0, 0, 48, 48);
    var type = canvas.attr("type");
    var x = Number(canvas.attr("picX"));
    var y = Number(canvas.attr("picY"));
    drawItem(type, x, y, ctx);
  }

  function fillCanvases() {
    canvases.each(function(){
      var item = $(this);
      if(item.hasClass('item') && item.attr('picX') != null) {
        item.css('background', 'none');
        drawFromItemList(item);
      }
    });
    doRandomImages(); // Start em going
    countMats(); // Initial Mat Count
  }

  function init() {
    $('#pp').attr('title', "If you've found this useful please consider.\nAnything is much appreciated.");
    var setList = document.getElementById("setList");
    var setList2 = document.getElementById("setList2");

    loadImages();

    for (var i = 0; i < armor.length; i++) {
      if (i < 14) {
        setList.appendChild(createSet(armor[i]));
      } else {
        setList2.appendChild(createSet(armor[i]));
      }
    }

    resultDisplay = document.getElementById("result");
    checkboxes = $("input[type=checkbox]");
    canvases = $("canvas");
    window.addEventListener("click", function (event) {
      countMats();
      doSave();
    });
    canvases.on('click', function() {
      console.log('handling canvas click');
      var c = $(this);
      toggleTick(c);
      countMats();
      doSave();
    });

    //Right click / long press = select/deselect all
    checkboxes.each(function() { 
      var source = $(this);
      if (source.hasClass('inclusionCheckbox')) {
        source.contextmenu(function (e) {
          e.preventDefault();
          var isSourceChecked = !source.prop('checked');
          checkboxes.each(function(){
            var checkbox = $(this);
            if(checkbox.hasClass('inclusionCheckbox')){
              checkbox.prop('checked', isSourceChecked);
            }
          });
          doSave();
          countMats();
        });
      }
    });

    //Right click / long press = select/deselect all items in set
    canvases.each(function() {
      var source = $(this);
      if(source.hasClass('item')){
        source.contextmenu(function(e){
          e.preventDefault();

          var isSourceSet = source.prop('set');
          var curCondition = !source.prop('ticked');
          canvases.each(function(){
            var canvas = $(this);
            if (canvas.prop('set') === isSourceSet) {
              canvas.prop('ticked', curCondition);
              drawFromItemList(canvas);
              doSave();
              countMats();
            }
          });
          countMats();
        });
      }
    });
    doLoadStorage();
  }

  function countMats() {
    var result = {};

    var sets = $('.itemSet');

    var active = sets.filter(':has(.setIncluded > input:checked)');
    console.log('active items:', active.length);
    console.log('active full:', active);
    active.each(function(){
      var items = $(this).find('canvas');
      console.log('child canvases:', items.length);
      items.each(function(){
        var canvas = $(this);
        if(canvas.prop('ticked')) {
          return;
        }
        var upgrades = canvas[0].upgrades;
        for (var i = 0; i < upgrades.length; i++) {
          var upgrade = upgrades[i];
          var ugName = upgrades[i]["name"];
          result[ugName] = result[ugName] || {};

          result[ugName]["mat"] = result[ugName]["mat"] || 0;
          result[ugName]["desc"] = result[ugName]["desc"] || '';

          result[ugName]["mat"] = result[ugName]["mat"] + upgrades[i]["qty"];
          result[ugName]["desc"] = result[ugName]["desc"];
        }
      });
    });
    displayResult(result);
  }

  function displayResult(countResult) {
    console.log('displaying result', countResult);
    var resultString = "";
    var sortable = [];
    for (var x in countResult) {
      sortable.push([x, countResult[x]["mat"], countResult[x]["desc"]]);
    }
    sortable.sort();
    sortable.forEach(function (each) {
      resultString += '<span title="' + each[2] + '">';
      resultString += '<a href="http://zelda.wikia.com/wiki/' + each[0].replace("'", "%27") + '" target="_blank">';
      resultString += each[0] + '</a>';
      resultString += ' - ' + each[1] + '</span><br>';
    });
    resultDisplay.innerHTML = resultString;
  }

  function toggleTick(canvas) {
    if (canvas.hasClass('item')) {
      var current = canvas.prop('ticked');
      console.log('tick target has item class, ticked?', current);
      canvas.prop('ticked', !current);
      console.log('tick target new ticked:', current);
      drawFromItemList(canvas);
    }
  }

  function doSave() {
    console.log('saving to local storage: ' + checkboxes.length + ' checkboxes, ' + canvases.length + ' canvases');
    var cbData = JSON.stringify(checkboxes.map(function () {
      var m = $(this);
      return m.prop('checked');
    }));
    localStorage.setItem("checkboxes", cbData);
    var cvData = JSON.stringify(canvases.map(function () {
      var m = $(this);
      return m.prop('ticked');
    }));
    //console.log('saving canvas data:', cvData);
    localStorage.setItem("canvases", cvData);
  }

  function doLoadStorage() {
    console.log('doing storage load');
    if (localStorage.getItem("checkboxes")) {
      (function () {
        var cbData = localStorage.getItem('checkboxes');
        var savedChecks = JSON.parse(cbData);
        var cvData = localStorage.getItem('canvases');
        var savedCanvases = JSON.parse(cvData);
        checkboxes.each(function(idx, dom){
          var checkbox = $(this);
          checkbox.prop('checked', savedChecks[idx]);
        });
        canvases.each(function(idx, dom){
          var canvas = $(this);
          canvas.prop('ticked', savedCanvases[idx]);
        });
      })();
    }
  }

  return { init: init };
}();
