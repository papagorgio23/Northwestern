#Brian Macdonald PRED-490
#D.5 Experiment with Python Array Capabilities

#This week, your job is to create a Python code that will perform those steps.#
#
#I specifically would like you to try to carry out vector dot products in two different ways:
#
# 1) Use a loop ('while' or other loop structure), and multiply the indexed elements of two vectors against each other, 
#    then adding the result of that multiplication to a sum, 
#
# 2) Directly use an array dot product function.

import numpy as np


#############
#
#  Create a matrix based on given rows and columns
#
##############

def createMatrix(rows,cols):
    matrixString = ""     # initiallize string to build matrix
    for x in range(rows):    # loop over number of rows requested
        for y in range(cols):  # loop over number of columns requestes
          matrixString += str((cols*x)+(y+1)) + " "  # Start at 1 and count up by 1 for martix values; build string of format "1 2 3; 4 5 6" to be used by np.matrix to build matrix
        matrixString += ";"   # add ; whenever you get to new row
    myMatrix = np.matrix(matrixString[:-1])   # create the matrix;  excluse last character as it is not needed.
    return (myMatrix)
########
#
# 1) Use a loop ('while' or other loop structure), and multiply the indexed elements of two vectors against each other, 
#    then adding the result of that multiplication to a sum, 
#
########
def dotProdWithLoop (m1,m2):

    if  m1.shape[1] == m2.shape[0]:                # check that # of columns of matrix 1 is same size as # of rows of matrix 2 as required for matrix multiplication
        #    create new matrix
        newMatrix = np.zeros((m1.shape[0],m2.shape[1]))    # crate xero filled matrix
        for x in range(m1.shape[0]):  #  Number of rows in matrix 1
            for y in range(m2.shape[1]):  # number of columns in matrix 2
                for z in range(m2.shape[0]):  # # of rows in matrix 2
                    newMatrix[x,y] += m1[x,z]*m2[z,y]   #Multiply values from both matrices and add to matrix location

        return (newMatrix)
    else:
        print " Can't multiply these matrices"    
       

    
########
#
# 2) Use matrix dot product functions
#
########
def dotProdNative (m1,m2):
    dotprod = np.dot(m1,m2)
    
    return(dotprod)    

########
#
# 2) sum matrix using native functions
#
########
def sumNative (m1):
    sumMatrix = m1.sum()
    
    return(sumMatrix)   
    
########
#
# 2) sum matrix using loop
#
########
def sumLoop (m1):
    sumMatrix = 0
    # loop over both axis for later flexibility
    for x in range(m1.shape[0]):  #  Number of rows in matrix 1
        for y in range(m1.shape[1]):  # number of columns in matrix 1
            sumMatrix += m1[x,y]
    
    return(sumMatrix)  
####    main    #####
    
def main():   
    
    m1 = createMatrix(5,2)
    m2 = createMatrix(2,5)
    print "Matrix 1:"
    print m1
    print "Matrix 2:"
    print m2
    m1Prod = dotProdWithLoop(m1,m2)
    m2Prod = dotProdNative(m1,m2)
    print "Numpy dot product is    : ", m1Prod
    print "Numpy sum  is    : ",sumNative(m1Prod)
    print "Dot product with loop is: ",m2Prod
    print "Loop sum  is    : ",sumLoop(m2Prod)

    
####################################################################################################
# Conclude specification of the MAIN procedure
####################################################################################################                
    
if __name__ == "__main__": main()

####################################################################################################
# End program
#################################################################################################### 