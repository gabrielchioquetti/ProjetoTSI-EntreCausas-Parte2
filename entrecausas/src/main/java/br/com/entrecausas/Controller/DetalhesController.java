package br.com.entrecausas.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DetalhesController {
    

    @GetMapping("/detalhes")
    public String paginaDetalhes(){
        return "detalhes";
    }
}
