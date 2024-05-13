@echo off
CALL "C:\ProgramData\anaconda3\Scripts\activate.bat" root
rem jupyter nbconvert --to markdown main.ipynb
rem jupyter nbconvert --to html main.ipynb
jupyter nbconvert --execute --to html main.ipynb --HTMLExporter.theme=dark
pause
