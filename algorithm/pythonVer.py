import Image
 
i1 = Image.open("logo2.png")
i2 = Image.open("logo3.png")
assert i1.mode == i2.mode, "Different kinds of images."
assert i1.size == i2.size, "Different sizes."
 
l1 = i1.getdata()
l2 = i2.getdata()
pairs = []
for i in range(len(i1.getdata())):
    pairs.append([l1[i],l2[i]])


if len(i1.getbands()) == 1:
    # for gray-scale jpegs
    print('gray-scale jpegs')
    dif = sum(abs(p1-p2) for p1,p2 in pairs)
else:
    print('NOT  gray-scale jpegs')
    dif = sum(abs(c1-c2) for p1,p2 in pairs for c1,c2 in zip(p1,p2))
 
ncomponents = i1.size[0] * i1.size[1] * 3
print "Difference (percentage):", (dif / 255.0 * 100) / ncomponents
