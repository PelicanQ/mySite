#!C:/Users/Oskar/AppData/Local/Programs/Python/Python38-32/python.exe
import requests
import cgi
import cgitb
cgitb.enable()

QQ = cgi.FieldStorage()["mid_upload"]

req = requests.post("http://flashmusicgames.com/midi/mid2txt.php", files = {"mid_upload" : QQ.file}, data = {"tt": "1"}, headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4136.7 Safari/537.36"
})
resp = req.text.lower()

midiText = resp[resp.find("<pre>")+5 : resp.find("</pre>")] + "\n"

result = ""

while len(midiText) > 0:
	eol = midiText.find("\n")
	if midiText.find(" on ", 0, eol) > -1:
		delay = midiText[0 : midiText.find(" ")]
		indexN = midiText.find("n=")
		note = midiText[indexN+2 : midiText.find(" ", indexN)]  
		result += f"\ndelay({delay} * factor);"
		result += f"\ntone(tonePin, round(tuning * 440*pow(2, ({note} - 69)/12.0)));"
	
	elif midiText.find(" off ", 0, eol) > -1:
		delay = midiText[0 : midiText.find(" ")]
		result += f"\ndelay({delay} * factor);"
		result += "\nnoTone(tonePin);"

	midiText = midiText[midiText.find("\n")+1:] 

#input("Press Enter to end\n")

print("Content-type: text/html")
print()
print("<html><head>")
print("</head><body><span id='code'>")
print(result)
print(resp)
print("</span></body></html>")