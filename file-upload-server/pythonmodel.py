import sys
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import json

# print('from pyhtonmodel')
df = pd.read_excel('Claims Data.xlsx')
ppr = ['Designation','MSTATUS','GENDER','EDUCATION','Claim_TYPE','Status']
df[ppr] = df[ppr].apply(LabelEncoder().fit_transform)
df.loc[df['INCOME'] < 1902.75, 'INCOME'] = 1902.75
df.loc[df['INCOME'] >  214186.75, 'INCOME'] = 214186.75
df = df.fillna(df.mean())
y = df['CLAIM_FLAG']
X = df[['ID', 'AGE', 'Designation', 'INCOME', 'MSTATUS', 'GENDER','EDUCATION', 'TRAVTIME', 'Claim_TYPE', 'Status', 'CLM_FREQ','Total CLM_AMT', 'CLM_AMT']]
X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.3)
model = RandomForestClassifier(n_estimators=100,random_state=50, max_features = 'sqrt', verbose = 1)
model.fit(X_train, y_train)
y_pred = model.predict([[889530074,12,2,20000,1,0,1,1,2,3,1200,1414,2]])
values = {"y_pred": int(y_pred[0])}
to_json= json.dumps(values)

print(values)
