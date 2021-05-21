import boto3
import sys

create_hits_in_live= False

environments = {
        "live": {
            "endpoint": "https://mturk-requester.us-east-1.amazonaws.com",
            "preview": "https://www.mturk.com/mturk/preview",
            "manage": "https://requester.mturk.com/mturk/manageHITs",
            "reward": "0.00"
        },
        "sandbox": {
            "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
            "preview": "https://workersandbox.mturk.com/mturk/preview",
            "manage": "https://requestersandbox.mturk.com/mturk/manageHITs",
            "reward": "0.00"
        },
}
worker_requirements = [
#     {
#     'QualificationTypeId': '000000000000000000L0',
#     'Comparator': 'GreaterThanOrEqualTo',
#     'IntegerValues': [92],
#     'RequiredToPreview': True,
# },{
#     'QualificationTypeId': '00000000000000000040',
#     'Comparator': 'GreaterThanOrEqualTo',
#     'IntegerValues': [500],
#     'RequiredToPreview': True,
# },
# {
#     'QualificationTypeId': '00000000000000000071',
#     'Comparator': 'EqualTo',
#     'LocaleValues': [{'Country':'US'}],
#     'RequiredToPreview': True,
# }
{
    'QualificationTypeId': '3OFCXZK7I3EIDFAI9BFPAQFX4URK9A',
    'Comparator': 'EqualTo',
    'IntegerValues':[100]
}

]

mturk_environment = environments["live"] if create_hits_in_live else environments["sandbox"]
MTURK_SANDBOX = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
mturk = boto3.client('mturk',
   aws_access_key_id = "",
   aws_secret_access_key = "",
   region_name='us-east-1',
   endpoint_url = mturk_environment['endpoint']
)



print ("I have $" + mturk.get_account_balance()['AvailableBalance'] + " in my Sandbox account")

def create_quali_eva_hits():
    quali_questions="""<QuestionForm xmlns='http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2005-10-01/QuestionForm.xsd'>  
  <Question>
      <QuestionIdentifier>self_report</QuestionIdentifier>
      <DisplayName>Q1</DisplayName>
      <IsRequired>true</IsRequired>
      <QuestionContent>
        <Text> Which statement best describes your color vision? </Text>
      </QuestionContent>
      <AnswerSpecification>
        <SelectionAnswer>
          <StyleSuggestion>radiobutton</StyleSuggestion>
          <Selections>
            <Selection>
              <SelectionIdentifier>rg</SelectionIdentifier>
              <Text>I am red-green colorblind.</Text>
            </Selection>
            <Selection>
              <SelectionIdentifier>by</SelectionIdentifier>
              <Text>I am blue-yellow colorblind.</Text>
            </Selection>
            <Selection>
              <SelectionIdentifier>other</SelectionIdentifier>
              <Text>I have some other issue with my color vision.</Text>
            </Selection>
            <Selection>
              <SelectionIdentifier>norm</SelectionIdentifier>
              <Text>My color vision is normal.</Text>
            </Selection>
          </Selections>
        </SelectionAnswer>
      </AnswerSpecification>
  </Question>
  <Question>
      <QuestionIdentifier>ishihara_39</QuestionIdentifier>
      <DisplayName>Q2</DisplayName>
      <IsRequired>true</IsRequired>
      <QuestionContent>
        <Text> What number do you see in the image below? </Text>
        <Binary>
          <MimeType>
            <Type>image</Type>
            <SubType>jpg</SubType>
          </MimeType>
          <DataURL>https://www.spservices.co.uk/images/products/pics/1401209116aw2271.jpg</DataURL>
          <AltText>Ishihara Color Plate</AltText>
        </Binary>
      </QuestionContent>
      <AnswerSpecification>
        <SelectionAnswer>
          <StyleSuggestion>radiobutton</StyleSuggestion>
          <Selections>
            <Selection>
              <SelectionIdentifier>122</SelectionIdentifier>
              <Text>122</Text>
            </Selection>
            <Selection>
              <SelectionIdentifier>74</SelectionIdentifier>
              <Text>74</Text>
            </Selection>
            <Selection>
              <SelectionIdentifier>21</SelectionIdentifier>
              <Text>21</Text>
            </Selection>
            <Selection>
              <SelectionIdentifier>none</SelectionIdentifier>
              <Text>I don't see a number.</Text>
            </Selection>
          </Selections>
        </SelectionAnswer>
      </AnswerSpecification>
  </Question>
</QuestionForm>"""

    qual_response = mturk.create_qualification_type(Name='Visual Grounding Qualification',
                            Keywords='test, qualification, visual grounding',
                            Description='This is a visual grounding qualification test',
                            QualificationTypeStatus='Active',
                            Test=quali_questions,
                            # AnswerKey=answers,
                            TestDurationInSeconds=600)
    print(qual_response['QualificationType']['QualificationTypeId'])


def create_train_hits():
    groups=[]
    for i in range(6,10):
        groups.append('train_'+str(i))
    HITIDs=[]


    with open ('train_hitID.txt','a+') as w:

        for group in groups:
            question_xml="""<?xml version="1.0" encoding="UTF-8"?>
                            <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
                            <ExternalURL>http://localhost:3000/#/</ExternalURL>
                            <FrameHeight >0</FrameHeight>
                            </ExternalQuestion>"""

            # question_xml = open(file="VizWiz_EK.xml",mode='r').read()
            # question_xml=question_xml.replace('{{VizWiz_img}}','VizWiz_val_00001174.jpg')
            question=question_xml.replace('{{group}}',group)
            # print(question)
            new_hit = mturk.create_hit(
                Title = 'Does the image needs external knowledge?',
                Description = 'Watch the image and point out if it does not require any external knowledge or require common sense, expertise knowledge, or partial knowledge',
                Keywords = 'image, labeling',
                Reward = mturk_environment['reward'],
                MaxAssignments = 1,# does it mean multi-works can work on the same HIT?
                LifetimeInSeconds = 172800,
                AssignmentDurationInSeconds = 600,
                AutoApprovalDelayInSeconds = 14400,
                Question = question,
                # QualificationRequirements=worker_requirements,
            )
            hit_type_id = new_hit['HIT']['HITTypeId']
            # print ("A new HIT has been created. You can preview it here:")
            # print ("https://workersandbox.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'])
            print ("HITID = " + new_hit['HIT']['HITId'])
            w.write("groupindex:"+group+";"+"hitID:"+new_hit['HIT']['HITId']+'\n')
            # Remember to modify the URL above when you're publishing
            # HITs to the live marketplace.
            # Use: https://worker.mturk.com/mturk/preview?groupId=


    print ("\nYou can work the HIT here:")
    print (mturk_environment['preview'] + "?groupId={}".format(hit_type_id))

    # print ("\nAnd see results here:")
    # print (mturk_environment['manage'])



def create_quali_gt_hits():
    groups=[]
    for i in range(0,1):
        groups.append('qualification_'+str(i))
    HITIDs=[]

    with open ('qualification_gt_hitID.txt','w') as w:
        for group in groups:
            question_xml="""<?xml version="1.0" encoding="UTF-8"?>
                            <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
                            <ExternalURL>https://chongyanchen.com/TraditionalGroundingV2/qualification.html?groupindex={{group}}</ExternalURL>
                            <FrameHeight>0</FrameHeight>
                            </ExternalQuestion>"""

            question=question_xml.replace('{{group}}',group)
            new_hit = mturk.create_hit(
                Title = 'Does the image needs external knowledge?',
                Description = 'Watch the image and point out if it does not require any external knowledge or require common sense, expertise knowledge, or partial knowledge',
                Keywords = 'image, labeling',
                Reward = mturk_environment['reward'],
                MaxAssignments = 1,
                LifetimeInSeconds = 172800,
                AssignmentDurationInSeconds = 600,
                AutoApprovalDelayInSeconds = 14400,
                Question = question
            )
            hit_type_id = new_hit['HIT']['HITTypeId']
            print ("HITID = " + new_hit['HIT']['HITId'])
            w.write("groupindex:"+group+";"+"hitID:"+new_hit['HIT']['HITId']+'\n')


    print ("\nYou can work the HIT here:")
    print (mturk_environment['preview'] + "?groupId={}".format(hit_type_id))
if __name__ == "__main__":
    #https://workersandbox.mturk.com/mturk/preview?groupId=3D4BPCICWMINIP7V52BGK82VUO78VK

    tasks=["qualification_gt","qualification_eva","train","val","test"]
    task=tasks[2]
    if task=="qualification_gt":
        create_quali_gt_hits()
    if task=="qualification_eva":
        create_quali_eva_hits()
    if task=="train":
        create_train_hits()


