# Convert the K6 results to a format that Jmeter can process so we can get graphs
# Must be in CSV format
# K6 format
# metric_name,timestamp,metric_value,check,error,error_code,expected_response,group,method,name,proto,scenario,service,status,subproto,tls_version,url,extra_tags,metadata
# get_payments,1683005406,1288.898100,,,,,,,,,TransferMoneyInternal,,,,,,,

# Jmeter format
# timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect
# 1667365916729,115,aggregate_incidents,200,OK,List incidents 3-1,text,true,,944,1274,1,9,"/aggregates/incidents",115,0,0

'''
How to use : 
    Run K6 and ensure --out csv=your_filepath.csv has been set. 
    Change the k6_file variable to the location of the csv file
    Run
    Open jmeter, add the graphs you want, point the Jmeter Graphs to the outputted file. Hit enter
    Save the graphs to where you want for reporting purposes
'''
import csv
counter = 0 # Only for debugging
output_rows = []
k6_file = 'file.csv'
output_file = 'file_jmeter.csv'
skip = ['vus','vus_max','http_reqs','http_req_duration','http_req_blocked','http_req_connecting','http_req_tls_handshaking','http_req_sending','checks','http_req_failed','http_req_receiving','http_req_waiting','iteration_duration','iterations','data_sent','data_received']

def convert_to_jmeter_row(row):
    timestamp = int(row['timestamp']) * 1000
    elapsed = int(float(row['metric_value']))
    label = row['metric_name']
    responseCode = '200'
    responseMessage = 'OK'
    threadName = row['scenario']
    dataType = 'text'
    success = 'true'
    failureMessage = ''
    bytes = 1
    sentBytes = 2
    grpThreads = 1
    allThreads = 1
    url = row['metric_name']
    Latency = elapsed
    IdleTime = 0
    Connect = 0
    return [timestamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,url,Latency,IdleTime,Connect]


with open(k6_file, newline='') as file:
    reader = csv.DictReader(file, delimiter=',')
    for row in reader:
        if row['metric_name'] not in skip:
            counter += 1
            output_rows.append(convert_to_jmeter_row(row))

with open(output_file, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow('timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect'.split(','))
    for row in output_rows:
        writer.writerow(row)

