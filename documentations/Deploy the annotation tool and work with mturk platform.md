# Deploy the annotation tool and work with mturk platform

1. Run the app by **npm run start**
2. Check your AWS security credentials, and create Access keys (**access key ID** and **secret access key**)
3. Copy and paste access key ID and secret access key into **clear_HITs.py**, **create_tasks.py**, and **get_results.py** in AMT
4. Highly recommended: run **clear_HITs.py** to ensure you remove all the previous works
5. Run **create_tasks.py** to create a new task
6. Run **get_results.py** to download the results
7. Then, run **clear_HITs.py** to clean the works
8. In **client/src/pages/Home/SubmitHIT/main_SubmitHIT.js**, line 141 creates the submit url, line 6 defines env. In production or development mode, pressing the submit on the main page will send annotation results to different url. You can see the urls in **client/src/config.json**