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

    var data = {"OkPercent": 93.704, "KoPercent": 6.296};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7367586206896551, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.963, 500, 1500, "Course Content"], "isController": true}, {"data": [0.76, 500, 1500, "Dashboard"], "isController": true}, {"data": [0.847, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-1"], "isController": false}, {"data": [0.004, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://aipro.bytelab.live/public/subscription/calculate-cost?plan_id=4401e763-a689-42b9-81ad-41cf1b6f7dc0&billing_cycle=12&student_count=100"], "isController": false}, {"data": [0.5915, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-0"], "isController": false}, {"data": [0.997, 500, 1500, "https://aipro.bytelab.live/users/profile"], "isController": false}, {"data": [0.983, 500, 1500, "https://aipro.bytelab.live/public/subscription/plans"], "isController": false}, {"data": [0.986, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-0"], "isController": false}, {"data": [0.988, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-1"], "isController": false}, {"data": [0.093, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/-3"], "isController": false}, {"data": [0.977, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-2"], "isController": false}, {"data": [0.983, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-3"], "isController": false}, {"data": [0.0, 500, 1500, "Homepage"], "isController": true}, {"data": [0.002, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/"], "isController": false}, {"data": [0.434, 500, 1500, "Login"], "isController": true}, {"data": [0.991, 500, 1500, "https://aipro.bytelab.live/class_content/fa3c4fb4-2910-4cec-8f8e-bc1b19d51e30"], "isController": false}, {"data": [0.434, 500, 1500, "https://aipro.bytelab.live/auth/login"], "isController": false}, {"data": [0.916, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com"], "isController": false}, {"data": [0.996, 500, 1500, "https://aipro.bytelab.live/ai-content/summary/257563ac-7cb8-4477-abd1-57eab6893f35"], "isController": false}, {"data": [0.995, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com"], "isController": false}, {"data": [0.996, 500, 1500, "https://aipro.bytelab.live/enrollments/student/courses"], "isController": false}, {"data": [0.997, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-3"], "isController": false}, {"data": [0.999, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-2"], "isController": false}, {"data": [0.999, 500, 1500, "https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12500, 787, 6.296, 3651.9320000000007, 7, 88330, 64.0, 3640.399999999998, 37073.349999999984, 58604.53999999999, 45.91267042783262, 23158.94122498104, 52.176105623016575], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Course Content", 500, 0, 0.0, 220.93200000000007, 37, 3491, 145.0, 424.80000000000007, 561.75, 1229.6200000000003, 1.8723225787124413, 22.972008426387767, 4.086563440842096], "isController": true}, {"data": ["Dashboard", 500, 0, 0.0, 613.0319999999996, 85, 5361, 457.5, 1242.8000000000002, 1556.6, 3509.98, 1.8711314357565731, 13.987445702104647, 14.14312237573816], "isController": true}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-1", 1000, 2, 0.2, 521.1750000000003, 71, 10902, 394.0, 812.0, 1121.9499999999985, 2823.790000000001, 3.7013595093477836, 156.44418401910272, 3.1437265657676066], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-2", 500, 0, 0.0, 41204.33400000007, 1115, 88274, 41786.5, 60837.5, 67028.84999999999, 82619.67000000001, 1.8462992777277225, 10248.223110035744, 1.5668301487747958], "isController": false}, {"data": ["https://aipro.bytelab.live/public/subscription/calculate-cost?plan_id=4401e763-a689-42b9-81ad-41cf1b6f7dc0&billing_cycle=12&student_count=100", 500, 500, 100.0, 52.361999999999966, 7, 3606, 42.0, 48.0, 53.0, 210.91000000000008, 1.8690051659302787, 0.7043192650978237, 1.5860991105404416], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-0", 1000, 0, 0.0, 1320.1399999999999, 21, 11931, 313.5, 3726.7999999999997, 4827.349999999997, 7068.370000000001, 3.690935799862697, 801.9098689625517, 3.09260050418183], "isController": false}, {"data": ["https://aipro.bytelab.live/users/profile", 500, 0, 0.0, 64.9160000000001, 9, 2203, 45.0, 59.900000000000034, 180.89999999999998, 407.82000000000016, 1.8722174168641856, 1.8208594215129015, 1.305432847305692], "isController": false}, {"data": ["https://aipro.bytelab.live/public/subscription/plans", 500, 0, 0.0, 131.8580000000001, 7, 1421, 122.5, 168.80000000000007, 375.6499999999999, 1139.97, 1.8676298656427075, 6.434397078886818, 1.324120393024029], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-0", 500, 0, 0.0, 132.60399999999996, 9, 2222, 66.0, 187.7000000000001, 379.54999999999967, 1172.8700000000001, 1.8716637593489605, 1.8533857929490682, 1.4074034127916988], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-1", 500, 0, 0.0, 104.37999999999998, 12, 1419, 51.0, 146.90000000000003, 294.9, 1151.95, 1.8719650766195306, 0.2211989983114875, 1.4332232617868281], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-3", 500, 2, 0.4, 3137.201999999998, 540, 16019, 2855.0, 5447.100000000001, 6541.749999999999, 11607.470000000005, 1.8506797546738918, 821.5990911196058, 3.167221523590615], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-2", 500, 0, 0.0, 133.856, 13, 3814, 52.0, 182.90000000000003, 385.95, 1181.97, 1.8719580681392738, 0.2211981701609884, 1.4551549045301384], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com-3", 500, 0, 0.0, 123.86799999999988, 12, 3168, 53.0, 177.90000000000003, 299.79999999999995, 1146.99, 1.8719230265251492, 0.22119402950150688, 1.456955714981], "isController": false}, {"data": ["Homepage", 500, 500, 100.0, 41481.60200000004, 1168, 88500, 42037.0, 61077.4, 67539.04999999999, 82845.74, 1.8371613652313536, 11158.125059994802, 10.620113150768486], "isController": true}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/", 500, 2, 0.4, 41297.38200000001, 1137, 88330, 41885.0, 60889.3, 67078.59999999999, 82665.71000000002, 1.8387490622379783, 11160.7402323926, 7.765224037782616], "isController": false}, {"data": ["Login", 500, 281, 56.2, 218.8099999999999, 171, 1307, 208.0, 215.0, 240.89999999999998, 548.8200000000002, 1.8680624829539298, 1.1735774178799734, 1.5013822494834808], "isController": true}, {"data": ["https://aipro.bytelab.live/class_content/fa3c4fb4-2910-4cec-8f8e-bc1b19d51e30", 500, 0, 0.0, 88.16200000000006, 14, 2785, 50.0, 143.7000000000001, 316.7999999999997, 943.1300000000035, 1.8724698251487677, 9.43163416644197, 1.3732664440300044], "isController": false}, {"data": ["https://aipro.bytelab.live/auth/login", 500, 281, 56.2, 218.80999999999986, 171, 1307, 208.0, 215.0, 240.89999999999998, 548.8200000000002, 1.8680764416879938, 1.1735861872092808, 1.5013934682707217], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/classes?email=cisintern2024@gmail.com", 500, 0, 0.0, 326.2220000000003, 32, 3996, 165.0, 642.200000000001, 1302.95, 2350.5300000000007, 1.871530650057456, 2.5166969776651533, 5.751666948955873], "isController": false}, {"data": ["https://aipro.bytelab.live/ai-content/summary/257563ac-7cb8-4477-abd1-57eab6893f35", 500, 0, 0.0, 66.068, 10, 1401, 47.0, 71.0, 209.74999999999994, 471.8900000000001, 1.872729315704708, 6.402590862485486, 1.3826009401101165], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com", 500, 0, 0.0, 142.426, 28, 4201, 99.5, 340.90000000000003, 355.0, 403.97, 1.8718739704693164, 2.51715864974243, 5.760034063426577], "isController": false}, {"data": ["https://aipro.bytelab.live/enrollments/student/courses", 1000, 0, 0.0, 73.08499999999988, 10, 3924, 46.0, 79.89999999999998, 231.6999999999996, 464.98, 3.7442946310559284, 14.27844341715561, 2.6619594642663245], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-3", 500, 0, 0.0, 69.24600000000005, 13, 4121, 49.0, 67.90000000000003, 114.94999999999999, 320.9100000000001, 1.8720982477160402, 0.22121473434925867, 1.4570920931930509], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-0", 500, 0, 0.0, 58.01799999999998, 13, 755, 46.0, 66.0, 102.64999999999992, 301.98, 1.872028155303456, 1.8537466303493206, 1.4149900314500732], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-2", 500, 0, 0.0, 58.836000000000006, 9, 349, 49.0, 64.0, 97.84999999999997, 311.95000000000005, 1.8721823655398624, 0.22122467405305019, 1.4553292607126276], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/myhome/undefined/enrollments?email=cisintern2024@gmail.com-1", 500, 0, 0.0, 58.94999999999995, 8, 546, 49.0, 68.80000000000007, 100.74999999999994, 302.98, 1.8720982477160402, 0.22121473434925867, 1.4333252209075933], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 500, 63.53240152477764, 4.0], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.12706480304955528, 0.008], "isController": false}, {"data": ["500/Internal Server Error", 281, 35.705209656925035, 2.248], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.12706480304955528, 0.008], "isController": false}, {"data": ["Assertion failed", 4, 0.5082592121982211, 0.032], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12500, 787, "400/Bad Request", 500, "500/Internal Server Error", 281, "Assertion failed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-1", 1000, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aipro.bytelab.live/public/subscription/calculate-cost?plan_id=4401e763-a689-42b9-81ad-41cf1b6f7dc0&billing_cycle=12&student_count=100", 500, 500, "400/Bad Request", 500, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/-3", 500, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://diu.aiteacher.daffodilglobal.ai/", 500, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aipro.bytelab.live/auth/login", 500, 281, "500/Internal Server Error", 281, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
