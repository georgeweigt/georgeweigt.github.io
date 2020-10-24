library(itsmr)

text =
"
     1        9.79932         .71405        8.39982       11.19882
     2        9.66565         .92883        7.84518       11.48612
     3        9.55445        1.05211        7.49235       11.61654
     4        9.46194        1.12958        7.24801       11.67587
     5        9.38498        1.18022        7.07180       11.69816
     6        9.32095        1.21403        6.94150       11.70040
     7        9.26769        1.23689        6.84344       11.69194
     8        9.22338        1.25246        6.76860       11.67816
     9        9.18652        1.26313        6.71083       11.66220
    10        9.15585        1.27046        6.66580       11.64590
"

x = lake - mean(lake)
a = yw(x,1)
m1 = forecast(lake,NULL,a,opt=0) # list
m1 = matrix(unlist(m1),ncol=4)
m2 = read.table(text=text)       # data frame
m2 = matrix(unlist(m2),ncol=5)
m2 = m2[,-1] # remove first column

d = m1-m2
print(d)
print(abs(d) < 1e-5)

text =
"
     1        9.66695         .69091        8.31279       11.02111
     2        9.46549        1.01434        7.47743       11.45355
     3        9.32526        1.13846        7.09391       11.55660
     4        9.22764        1.19397        6.88750       11.56779
     5        9.15970        1.21996        6.76862       11.55078
     6        9.11240        1.23236        6.69703       11.52778
     7        9.07948        1.23832        6.65242       11.50654
     8        9.05657        1.24120        6.62387       11.48927
     9        9.04061        1.24259        6.60519       11.47604
    10        9.02951        1.24326        6.59276       11.46626
"

x = lake - mean(lake)
a = hannan(x,1,1)
A = forecast(lake,NULL,a,opt=0)
B = read.table(text=text)

d = A$pred - B$V2
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$se - B$V3
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$l - B$V4
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$u - B$V5
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

text =
"
     1        9.71446         .69406        8.35412       11.07481
     2        9.45517        1.01565        7.46453       11.44582
     3        9.26650        1.15096        7.01067       11.52234
     4        9.14795        1.20035        6.79531       11.50060
     5        9.07945        1.21644        6.69527       11.46362
     6        9.04207        1.22119        6.64858       11.43557
     7        9.02257        1.22249        6.62655       11.41860
     8        9.01278        1.22281        6.61611       11.40945
     9        9.00803        1.22289        6.61121       11.40484
    10        9.00580        1.22291        6.60895       11.40265
"

x = lake - mean(lake)
a = hannan(x,2,1)
A = forecast(lake,NULL,a,opt=0)
B = read.table(text=text)

d = A$pred - B$V2
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$se - B$V3
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$l - B$V4
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$u - B$V5
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

text =
"
     1        9.61898         .69243        8.26185       10.97611
     2        9.44243        1.02232        7.43873       11.44614
     3        9.31478        1.14020        7.08003       11.54952
     4        9.22430        1.19503        6.88207       11.56652
     5        9.16016        1.22165        6.76577       11.55456
     6        9.11471        1.23481        6.69453       11.53489
     7        9.08249        1.24137        6.64946       11.51553
     8        9.05966        1.24465        6.62019       11.49912
     9        9.04347        1.24629        6.60078       11.48616
    10        9.03200        1.24712        6.58770       11.47631
"

x = lake - mean(lake)
a = hannan(x,1,2)
A = forecast(lake,NULL,a,opt=0)
B = read.table(text=text)

d = A$pred - B$V2
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$se - B$V3
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$l - B$V4
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$u - B$V5
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

text =
"
     1        9.60908         .70123        8.23468       10.98347
     2        9.35893        1.02337        7.35316       11.36469
     3        9.19504        1.12782        6.98454       11.40554
     4        9.09558        1.16189        6.81831       11.37285
     5        9.03987        1.17168        6.74341       11.33632
     6        9.01160        1.17395        6.71070       11.31251
     7        8.99929        1.17431        6.69768       11.30090
     8        8.99547        1.17433        6.69382       11.29711
     9        8.99563        1.17433        6.69398       11.29729
    10        8.99731        1.17435        6.69562       11.29900
"

x = lake - mean(lake)
a = hannan(x,2,2)
A = forecast(lake,NULL,a,opt=0)
B = read.table(text=text)

d = A$pred - B$V2
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$se - B$V3
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$l - B$V4
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

d = A$u - B$V5
if (any(abs(d) > 1e-5)) cat("fail\n") else cat("ok\n")

