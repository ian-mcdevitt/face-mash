import urllib.request
from bs4 import BeautifulSoup
import re
import os

optionsPage = urllib.request.urlopen("https://en.wikipedia.org/wiki/Category:American_male_film_actors")

soup = BeautifulSoup(optionsPage, "lxml")

def hasNumbers(inputString):
	return any(char.isdigit() for char in inputString)

def download_pic(url):
	celebPage = urllib.request.urlopen(url)
	soup2 = BeautifulSoup(celebPage, "lxml")
	name = soup2.find("h1", {'id': "firstHeading"}).text
	data = soup2.find("table", {"class": "infobox"})
	
	if (data == None):
		data = soup2.find("img", {"class": "thumbimage"})
		if (data == None):
			print("\nFAILED!!!!!\n")
			return

	img = data.find_all("img")

	if (len(img) <= 0):
		return
		
	img = img[0]
	url = "https://"+img["src"][2:]
	index = url.find("px")
	index -= 3
	substr = url[index:index+5]
	if ("px" in substr):
		url = url.replace(substr, "700px")
		name = name.replace(" ", "_")
		print(name)
		name += ".jpg"
		try:
			urllib.request.urlretrieve(url, "imgs/"+name)
		except:
			pass

for link in soup.findAll('div', attrs={'class': "mw-category-group"}):
	children = link.find_all("a")
	for child in children:
		url = "https://en.wikipedia.org"+child["href"]
		download_pic(url)
