package com.minukodu.minuvis;

import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // android:windowBackground (styles.xml, @color/navBarDark) faerbt im Edge-to-Edge-Modus
    // die Flaeche HINTER Status- UND Navigation-Bar einheitlich ein einer Farbe.
    // Fuer eine abweichende Status-Bar-Farbe wird hier ein eigener Scrim obendrauf gelegt,
    // dessen Hoehe bei jeder Insets-Aenderung (Rotation etc.) an den echten Status-Bar-Inset angepasst wird.
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        View statusBarScrim = new View(this);
        statusBarScrim.setBackgroundColor(ContextCompat.getColor(this, R.color.windowBackgroundTeal));
        statusBarScrim.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, Gravity.TOP));

        ViewGroup root = findViewById(android.R.id.content);
        root.addView(statusBarScrim);

        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            int topInset = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()).top;
            ViewGroup.LayoutParams lp = statusBarScrim.getLayoutParams();
            lp.height = topInset;
            statusBarScrim.setLayoutParams(lp);
            statusBarScrim.bringToFront();
            return insets;
        });
    }
}
