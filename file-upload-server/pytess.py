#!/usr/bin/env python
# coding: utf-8
import sys 
import cv2
import numpy as np
import pytesseract
from PIL import Image
from pytesseract import image_to_string
import re
import json
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# print("Output from Python") 
# print("First name: " + sys.argv[1]) 
# print("Last name: " + sys.argv[2]) 
src_path = sys.argv[1]
image_name=sys.argv[2]

# src_path = "uploads"
# image_name="img4.jpg"
# print(src_path,image_name)




def get_string(img_path,img_name):
    # Read image with opencv
    # print("inside pyhton function"+"for"+img_path+"/"+img_name)
    img = cv2.imread(img_path+"/"+img_name)

    # Convert to gray
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply dilation and erosion to remove some noise
    kernel = np.ones((1, 1), np.uint8)
    img = cv2.dilate(img, kernel, iterations=100)
    img = cv2.erode(img, kernel, iterations=10)

    # Write image after removed noise
    # cv2.imwrite(img_path + "removed_noise.png", img)
    cv2.imwrite(img_path + "removed_noise.png", img)

    #  Apply threshold to get image with only black and white
    #img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)

    # Write the image after apply opencv to do some ...
    cv2.imwrite(src_path + "thres.png", img)

    # Recognize text with tesseract for python
    result = pytesseract.image_to_string(Image.open(src_path + "thres.png"))

    # Remove template file
    #os.remove(temp)
    
    return result


dateu = [0]
gst = [0]
total = [0]
items = [0]

si = get_string(src_path,image_name)
# print(si)
p = re.compile(r'(?:\d{1,2}?[\s|/|-])?(?:\d{1,2}/|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z|.]*[-|,]?\s?)?(?:\d{1,2}(?:nd|rd|st|th)?[,|-]?\s?)?(?:19|20)?[0-9][0-9]')

# Initiate a new list to store the dates once extracted
# new_data = [0]
extract = max(re.findall(p,si),key=len) 
new_data=extract

gst = re.compile(r'\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}')
# gst_n =[]
try:
    gst_n = max(re.findall(gst,si), key =len)
except:
    gst_n=""

#module for getting mobile no.
mob_num = re.compile(r'(\+91-)?(\+91)?([7-9]{1})([0-9]{9})')

#module for getting total amount
start = si.find('Total')
end = si.find('\n', start)
temp =  si[start:end]
totall = re.findall("\d+\.\d+",temp )
total=str(totall[len(totall)-1])

# #module for getting total items
# start = si.find('Items')
# end = si.find('\n', start)
# temp =  si[start:end]  
# items1 = re.findall("\d+\\d+",temp )
# items=items1
# print(items)

#pandas converting to dataframe

values = {"GST": gst_n,
'Price': total,
'Date' : new_data
}
to_json= json.dumps(values)

print(to_json)
 


