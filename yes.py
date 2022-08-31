
import re, random


import subprocess
import sys






def shuffle():
    f = open('telemetry/src/Control.js', 'r')
    all = f.read()
    all = all.replace("\n" + r"{/*DELIM*/}" + "\n", "")
    t = all.split("<Box>")[1].split("</Box>")[0]
    f.close()
    buttonGroupTypes = ['ButtonGroup', 'ButtonGroupRBVTimed', 'SwitchButton']
    allbf = all[all.find("<Grid item={1}")+1:]

    at = [i for i in re.findall("<Grid item[\s\S]*?[\s\S]*?<\/Grid>", allbf) if (any([(j in i) for j in buttonGroupTypes]) and not "className" in i)]
    shuffled = at[:]
    random.shuffle(shuffled)

    oldall = all[:]
    for i in range(len(at)):

        f1, f2 = at[i], shuffled[i]
        f1 = "".join([i+"\n" for i in f1.split("\n")[1:-1]])
        f2 = "".join([i+"  \n" for i in f2.split("\n")[1:-1]])
        f2 = "\n" + r"{/*DELIM*/}" + "\n" + f2
        # print(f1,"\nNEW\n", f2)
        # input()
        # print("\n"*3)
        all = all.replace(f1, f2)


    f = open('telemetry/src/Control.js', 'w')
    print(all, file=f)
    f.close()



f = open('telemetry/src/Control.js', 'r')
original = f.read()
f.close()


process = subprocess.Popen(
    ['npm', 'run', 'start-main'], stdout=subprocess.PIPE, stderr=subprocess.PIPE
)
buff = ""

try: 

    while True:
        out = process.stdout.read(1)
        if out == '' and process.poll() != None:
            break
        if out != '':
            buff += out.decode('utf-8')
        if ord(out.decode('utf-8')) == 10:
            if ("sent to" in buff):
                shuffle()
            print(buff, end = "")
            sys.stdout.flush()
            buff = ""

except KeyboardInterrupt:
    f = open('telemetry/src/Control.js', 'w')
    print(original, file=f, end = "")
    f.close()