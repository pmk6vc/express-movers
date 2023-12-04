# npm run deploy

gcloud functions deploy newUserFuncManualDeploy \
--runtime=nodejs18 \
--region=us-central1 \
--entrypoint=newUser \
--set-env-vars=[CONFIG_ENV=production]
--max-instances=5
--project=zugzwang-381922
--memory=128MB
--trigger-event=providers/firebase.auth/eventTypes/user.create
--trigger-resource=zugzwang-381922
# --service-account # TODO