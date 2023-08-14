package com.myfoodappchef;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.view.WindowManager;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        getWindow().setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, 
//   WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();

    }
}