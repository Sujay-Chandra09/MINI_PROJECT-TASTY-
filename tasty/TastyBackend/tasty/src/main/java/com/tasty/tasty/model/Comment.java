package com.tasty.tasty.model;

import java.util.Date;

public class Comment {
    private String commenterName;
    private String text;
    private Date timestamp;

    public Comment() {
        this.timestamp = new Date();
    }

    public String getCommenterName() { return commenterName; }
    public void setCommenterName(String commenterName) { this.commenterName = commenterName; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
