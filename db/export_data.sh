#!/bin/bash
cd /home/dante/UbuntuShare/NutShare/JavaProject/AutoReport/db
rm -f auto_report_lib.sql
mysqldump -uroot -p123456 auto_report_lib > auto_report_lib.sql
