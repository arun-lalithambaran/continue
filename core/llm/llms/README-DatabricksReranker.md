# Databricks Reranker

The Databricks Reranker adapter allows you to use your self-hosted reranking model deployed on Databricks to improve search results in Continue.

## Configuration

To use the Databricks Reranker, add the following to your Continue config:

```json
{
  "models": [
    {
      "title": "My Databricks Reranker",
      "provider": "databricksReranker",
      "model": "reranking_modeltest",
      "apiKey": "YOUR_DATABRICKS_API_KEY",
      "apiBase": "https://dbc-6514b464-70a2.cloud.databricks.com"
    }
  ]
}
```

### Required Parameters

- `title`: A display name for your reranker
- `provider`: Must be set to `databricksReranker`
- `model`: The name of your Databricks serving endpoint (e.g., `reranking_modeltest`)
- `apiKey`: Your Databricks API key/token

### Optional Parameters

- `apiBase`: The base URL of your Databricks instance (default: `https://dbc-6514b464-70a2.cloud.databricks.com`)

## Input/Output Format

The reranker expects your Databricks model to:

1. Accept input in the format:
   ```json
   {
     "dataframe_split": {
       "columns": ["query", "document"],
       "data": [
         ["your search query", "document content 1"],
         ["your search query", "document content 2"],
         ...
       ]
     }
   }
   ```

2. Return output in the format:
   ```json
   {
     "predictions": [0.75, 0.25, ...]
   }
   ```
   where each value is a relevance score between 0 and 1.

## Example Model

Here's an example of how to use the Databricks reranker with a Python model:

```python
import os
import requests
import numpy as np
import pandas as pd
import json

def create_tf_serving_json(data):
    return {'inputs': {name: data[name].tolist() for name in data.keys()} if isinstance(data, dict) else data.tolist()}

def score_model(dataset):
    url = 'https://dbc-6514b464-70a2.cloud.databricks.com/serving-endpoints/reranking_modeltest/invocations'
    headers = {'Authorization': f'Bearer {os.environ.get("DATABRICKS_TOKEN")}', 'Content-Type': 'application/json'}
    ds_dict = {'dataframe_split': dataset.to_dict(orient='split')} if isinstance(dataset, pd.DataFrame) else create_tf_serving_json(dataset)
    data_json = json.dumps(ds_dict, allow_nan=True)
    response = requests.request(method='POST', headers=headers, url=url, data=data_json)
    if response.status_code != 200:
        raise Exception(f'Request failed with status {response.status_code}, {response.text}')
    return response.json()
```