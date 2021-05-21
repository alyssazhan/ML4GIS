import boto3
import json
import pandas as pd
MTURK_SANDBOX = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
mturk = boto3.client('mturk',
   aws_access_key_id = "",
   aws_secret_access_key = "",
   region_name='us-east-1',
   endpoint_url = MTURK_SANDBOX
)
# You will need the following library
# to help parse the XML answers supplied from MTurk
# Install it in your local environment with
# pip install xmltodict
import xmltodict


def get_ann_results(task):
    hitID_path=task+'_hitID.txt'
    csv_path=task+"_results.csv"
    json_path=task+"_results.json"
    # Use the hit_id previously created
    with open (hitID_path,'r') as f:
        lines=f.read().splitlines()
        
    JSON={}
    DF=pd.Series([],dtype=pd.StringDtype())
    # We are only publishing this task to one Worker
    # So we will get back an array with one item if it has been completed
    for line in lines:
        hit_id = line.split(";")[1].split(":")[1]
        groupindex = line.split(";")[0].split(":")[1]
        c = line.split(";")[0].split(":")[1]
        worker_results = mturk.list_assignments_for_hit(HITId=hit_id, AssignmentStatuses=['Submitted'])#'Approved',Submitted,Rejected
        # print(worker_results)
        # print("test")

        if worker_results['NumResults'] > 0:
            for assignment in worker_results['Assignments']:
                xml_doc = xmltodict.parse(assignment['Answer'])
                print(xml_doc['QuestionFormAnswers']['Answer']['QuestionIdentifier'])
                if str(xml_doc['QuestionFormAnswers']['Answer']['QuestionIdentifier'])=="Annotation":
                    print("passed")
                    Annotation=json.loads(xml_doc['QuestionFormAnswers']['Answer']['FreeText'])
                    print("get comments")
            All_answers={groupindex:{"Hit_id":hit_id,"Submit":"Yes","Annotation":Annotation}}
        else:
            All_answers={groupindex:{"Hit_id":hit_id,"Submit":"No"}}

        df = pd.DataFrame.from_dict(All_answers, orient="index")
        JSON={**JSON,**All_answers}
        DF=pd.concat([DF,df])
    DF.to_csv(csv_path)

    with open (json_path,'w') as jsonf:
        json.dump(JSON, jsonf, indent=4, sort_keys=True)




if __name__ == "__main__":
    tasks=["qualification_gt","qualification_eva","train","val","test"]
    # task=tasks[2]
    task=tasks[2]

    get_ann_results(task)


