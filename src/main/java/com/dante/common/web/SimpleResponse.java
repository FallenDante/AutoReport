package com.dante.common.web;

/**
 * Created by dante on 5/21/17.
 */
public class SimpleResponse {
    public final static int RESPONSE_SUCCESS = 1;
    public final static int RESPONSE_FAIL = 0;

    private int statusCode;


    private String comment;

    public SimpleResponse(int statusCode) {
        this.statusCode = statusCode;

    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
