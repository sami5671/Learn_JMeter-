/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 92.8, "KoPercent": 7.2};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7551724137931034, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Course Content"], "isController": true}, {"data": [1.0, 500, 1500, "Dashboard"], "isController": true}, {"data": [0.95, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://aipro.bytelab.live/public/subscription/calculate-cost?plan_id=4401e763-a689-42b9-81ad-41cf1b6f7dc0&billing_cycle=12&student_count=100"], "isController": false}, {"data": [0.8, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://aipro.bytelab.live/users/profile"], "isController": false}, {"data": [1.0, 500, 1500, "https://aipro.bytelab.live/public/subscription/plans"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-3"], "isController": false}, {"data": [0.0, 500, 1500, "Homepage"], "isController": true}, {"data": [0.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/"], "isController": false}, {"data": [0.2, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://aipro.bytelab.live/class_content/fa3c4fb4-2910-4cec-8f8e-bc1b19d51e30"], "isController": false}, {"data": [0.2, 500, 1500, "https://aipro.bytelab.live/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com"], "isController": false}, {"data": [1.0, 500, 1500, "https://aipro.bytelab.live/ai-content/summary/257563ac-7cb8-4477-abd1-57eab6893f35"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com"], "isController": false}, {"data": [1.0, 500, 1500, "https://aipro.bytelab.live/enrollments/student/courses"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 125, 9, 7.2, 395.4799999999999, 7, 3529, 29.0, 1589.8000000000006, 2780.0999999999967, 3528.48, 30.909990108803168, 15591.32356577646, 35.13958758345698], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Course Content", 5, 0, 0.0, 59.4, 39, 109, 47.0, 109.0, 109.0, 109.0, 8.051529790660224, 98.7884963768116, 17.573407306763286], "isController": true}, {"data": ["Dashboard", 5, 0, 0.0, 118.4, 73, 266, 78.0, 266.0, 266.0, 266.0, 5.88235294117647, 43.97288602941177, 44.46231617647059], "isController": true}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-1", 10, 0, 0.0, 390.5, 70, 1337, 362.0, 1249.7000000000003, 1337.0, 1337.0, 3.8446751249519417, 162.55391556132258, 3.2721038783160323], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-2", 5, 0, 0.0, 2726.8, 2249, 3229, 2575.0, 3229.0, 3229.0, 3229.0, 1.531862745098039, 8502.885407092524, 1.2999889897365198], "isController": false}, {"data": ["https://aipro.bytelab.live/public/subscription/calculate-cost?plan_id=4401e763-a689-42b9-81ad-41cf1b6f7dc0&billing_cycle=12&student_count=100", 5, 5, 100.0, 17.8, 7, 30, 20.0, 30.0, 30.0, 30.0, 5.841121495327102, 2.201829001168224, 4.956967362733645], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-0", 10, 0, 0.0, 552.2, 77, 1450, 429.5, 1419.0, 1450.0, 1450.0, 3.7593984962406015, 816.7843926221805, 3.1499647556390977], "isController": false}, {"data": ["https://aipro.bytelab.live/users/profile", 5, 0, 0.0, 18.8, 8, 43, 17.0, 43.0, 43.0, 43.0, 7.6452599388379205, 7.436209862385321, 5.330776949541284], "isController": false}, {"data": ["https://aipro.bytelab.live/public/subscription/plans", 5, 0, 0.0, 77.0, 29, 196, 58.0, 196.0, 196.0, 196.0, 4.793863854266539, 16.51542275886865, 3.3987745685522532], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-0", 5, 0, 0.0, 20.4, 8, 60, 11.0, 60.0, 60.0, 60.0, 6.377551020408164, 6.31527024872449, 4.795619419642857], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-1", 5, 0, 0.0, 19.2, 11, 44, 13.0, 44.0, 44.0, 44.0, 6.784260515603799, 0.8016557835820896, 5.194199457259159], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-3", 5, 0, 0.0, 1616.4, 1504, 1832, 1551.0, 1832.0, 1832.0, 1832.0, 1.923816852635629, 854.1201994757598, 3.2990453058868794], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-2", 5, 0, 0.0, 22.2, 15, 44, 17.0, 44.0, 44.0, 44.0, 6.747638326585696, 0.7973283569500674, 5.245234480431849], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-3", 5, 0, 0.0, 19.6, 11, 44, 15.0, 44.0, 44.0, 44.0, 6.7658998646820026, 0.7994862144790257, 5.266037297023004], "isController": false}, {"data": ["Homepage", 5, 5, 100.0, 3142.4, 2577, 3605, 3001.0, 3605.0, 3605.0, 3605.0, 1.3171759747102212, 7999.994082998552, 7.618782517781876], "isController": true}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/", 5, 0, 0.0, 3047.6, 2351, 3529, 2963.0, 3529.0, 3529.0, 3529.0, 1.348799568384138, 8186.907792689507, 5.700785675748584], "isController": false}, {"data": ["Login", 5, 4, 80.0, 188.2, 173, 229, 180.0, 229.0, 229.0, 229.0, 4.975124378109452, 2.4253731343283587, 3.998561878109453], "isController": true}, {"data": ["https://aipro.bytelab.live/class_content/fa3c4fb4-2910-4cec-8f8e-bc1b19d51e30", 5, 0, 0.0, 24.2, 15, 41, 24.0, 41.0, 41.0, 41.0, 8.375209380234505, 42.18684568676717, 6.14236547319933], "isController": false}, {"data": ["https://aipro.bytelab.live/auth/login", 5, 4, 80.0, 188.2, 173, 229, 180.0, 229.0, 229.0, 229.0, 4.975124378109452, 2.4253731343283587, 3.998561878109453], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com", 5, 0, 0.0, 44.2, 26, 106, 28.0, 106.0, 106.0, 106.0, 6.226650062266501, 8.373141734122042, 19.13600365815691], "isController": false}, {"data": ["https://aipro.bytelab.live/ai-content/summary/257563ac-7cb8-4477-abd1-57eab6893f35", 5, 0, 0.0, 18.6, 11, 34, 13.0, 34.0, 34.0, 34.0, 9.157509157509159, 31.309023008241756, 6.7608173076923075], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com", 5, 0, 0.0, 37.2, 23, 78, 29.0, 78.0, 78.0, 78.0, 6.906077348066298, 9.28678565262431, 21.251025120856355], "isController": false}, {"data": ["https://aipro.bytelab.live/enrollments/student/courses", 10, 0, 0.0, 17.4, 10, 39, 12.0, 38.5, 39.0, 39.0, 15.432098765432098, 58.84843991126543, 10.971257716049383], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-3", 5, 0, 0.0, 18.4, 11, 37, 13.0, 37.0, 37.0, 37.0, 7.363770250368188, 0.8701330081001473, 5.731371962444771], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-0", 5, 0, 0.0, 14.8, 9, 37, 9.0, 37.0, 37.0, 37.0, 7.072135785007072, 7.003071958981613, 5.34554013437058], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-2", 5, 0, 0.0, 16.4, 9, 37, 12.0, 37.0, 37.0, 37.0, 7.363770250368188, 0.8701330081001473, 5.724180780559646], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-1", 5, 0, 0.0, 19.0, 11, 37, 16.0, 37.0, 37.0, 37.0, 7.320644216691069, 0.8650370607613469, 5.604868228404099], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 5, 55.55555555555556, 4.0], "isController": false}, {"data": ["500/Internal Server Error", 4, 44.44444444444444, 3.2], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 125, 9, "400/Bad Request", 5, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aipro.bytelab.live/public/subscription/calculate-cost?plan_id=4401e763-a689-42b9-81ad-41cf1b6f7dc0&billing_cycle=12&student_count=100", 5, 5, "400/Bad Request", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aipro.bytelab.live/auth/login", 5, 4, "500/Internal Server Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
