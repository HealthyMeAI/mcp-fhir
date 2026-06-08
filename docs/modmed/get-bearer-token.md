Our firm prefix is: schweigerderm
These are environment variables that contain credentials for accessing the API:
MMSB_USERNAME 
MMSB_PASSWORD
MMSB_API_KEY

This is the auth url
https://stage.ema-api.com/ema-training/firm/schweigerderm/ema/ws/oauth2/grant

To Obtain a bearer token:
curl --location "https://stage.ema-api.com/ema-training/firm/schweigerderm/ema/ws/oauth2/grant" \
--header "x-api-key: $MMSB_API_KEY" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "grant_type=password" \
--data-urlencode "username=$MMSB_USERNAME" \
--data-urlencode "password=$MMSB_PASSWORD"

